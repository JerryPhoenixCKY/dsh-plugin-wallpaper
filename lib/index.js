// src/index.ts
import { createReadStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import z from "@deepseek-ai/schemastery";
var name = "wallpaper";
var NS = "wallpaper";
var WallpaperSchema = z.object({
  /** Master switch; the browser half applies nothing while false. */
  enabled: z.boolean().default(true),
  /** How the image fills the workspace. */
  fit: z.union(["cover", "contain", "center", "stretch"]).default("cover"),
  /** Dimming scrim drawn over the wallpaper (0 = none, 1 = black). */
  overlayOpacity: z.percent().default(0.12),
  /** Opacity of the app panels (1 = opaque, 0 = fully transparent). */
  panelOpacity: z.percent().default(0.94),
  /** Server-side image revision; 0 = no wallpaper stored. */
  revision: z.natural().default(0),
  /** Dimensions of the stored image (for the settings surface). */
  imageWidth: z.natural().default(0),
  imageHeight: z.natural().default(0)
});
var MAX_PAYLOAD_CHARS = 1e7;
var MAX_IMAGE_BYTES = 8e6;
var CHANNEL = "/wallpaper";
var ENDPOINT_SEGMENT_PATTERN = /^[A-Za-z0-9_$.-]+$/;
var MAX_RPC_BODY_BYTES = 14e6;
function endpointOf(pathname) {
  if (!pathname.startsWith(`${CHANNEL}/`)) return void 0;
  const endpoint = pathname.slice(CHANNEL.length + 1);
  if (endpoint.split("/").some((segment) => segment === "" || segment === "." || segment === ".." || !ENDPOINT_SEGMENT_PATTERN.test(segment))) return void 0;
  return endpoint;
}
function readBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_RPC_BODY_BYTES) {
        rejectBody(new Error("request body is too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    req.on("error", rejectBody);
  });
}
function respond(res, rpcId, result) {
  const text = JSON.stringify({ type: "server-response", rpcId, result });
  res.writeHead(200, { "Content-Type": "application/json", "Content-Length": String(Buffer.byteLength(text)) });
  res.end(text);
}
async function serveRpc(req, res, dispatch) {
  let pathname;
  try {
    pathname = new URL(req.url ?? "/", "http://wallpaper.local").pathname;
  } catch {
    pathname = "";
  }
  const endpoint = endpointOf(pathname);
  if (req.method !== "POST" || endpoint === void 0) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
    return;
  }
  const contentType = String(req.headers["content-type"] ?? "").split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    res.writeHead(415, { "Content-Type": "text/plain" });
    res.end("content type must be application/json");
    return;
  }
  let parsed;
  try {
    parsed = JSON.parse(await readBody(req));
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("body is not JSON");
    return;
  }
  const message = typeof parsed === "object" && parsed !== null ? parsed : {};
  const rpcId = typeof message.rpcId === "string" ? message.rpcId : "invalid-request";
  if (message.type !== "client-request" || typeof message.rpcId !== "string" || typeof message.method !== "string") {
    respond(res, rpcId, failBadRequest("invalid client-request message"));
    return;
  }
  if (message.method !== endpoint) {
    respond(res, rpcId, failBadRequest(`method ${JSON.stringify(message.method)} does not match endpoint ${JSON.stringify(endpoint)}`));
    return;
  }
  const controller = new AbortController();
  const onAborted = () => controller.abort();
  req.on("aborted", onAborted);
  try {
    respond(res, rpcId, await dispatch(endpoint, message.payload, controller.signal));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`handler failure: ${String(error)}`);
  } finally {
    req.off("aborted", onAborted);
  }
}
function ok(value) {
  return { ok: true, value };
}
function failBadRequest(message) {
  return { ok: false, error: { code: "bad-request", message, details: { issues: [] } } };
}
function failInternal(message) {
  return { ok: false, error: { code: "internal", message, details: {} } };
}
function dataDir() {
  const env = process.env.DSH_HOME?.trim();
  const home = env ? resolve(env) : join(homedir(), ".dsh");
  return join(home, "storages", "wallpaper");
}
function isWebp(buffer) {
  return buffer.length >= 12 && buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70 && buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80;
}
function apply(ctx) {
  const dir = dataDir();
  const filePath = join(dir, "wallpaper.webp");
  const metaPath = join(dir, "wallpaper.json");
  mkdirSync(dir, { recursive: true });
  const readMeta = () => {
    try {
      const raw = JSON.parse(readFileSync(metaPath, "utf8"));
      if (typeof raw.revision !== "number" || !Number.isInteger(raw.revision)) return null;
      return raw;
    } catch {
      return null;
    }
  };
  const scope = ctx.settings.register(NS, WallpaperSchema, { applies: "live" });
  const CONFIG_FIELDS = ["enabled", "fit", "overlayOpacity", "panelOpacity"];
  const dispatch = async (endpoint, payload, signal) => {
    if (signal?.aborted) return failInternal("aborted");
    switch (endpoint) {
      case "config/get": {
        return ok(scope.get());
      }
      case "config/set": {
        if (typeof payload !== "object" || payload === null) return failBadRequest("payload must be an object");
        const { patch } = payload;
        if (typeof patch !== "object" || patch === null || Array.isArray(patch)) return failBadRequest("patch must be an object");
        const clean = {};
        for (const key of Object.keys(patch)) {
          if (CONFIG_FIELDS.includes(key)) clean[key] = patch[key];
        }
        try {
          await scope.update(clean);
          return ok(scope.get());
        } catch (error) {
          return failBadRequest(String(error));
        }
      }
      case "put": {
        if (typeof payload !== "object" || payload === null) return failBadRequest("payload must be an object");
        const { data, width, height } = payload;
        if (typeof data !== "string" || data.length === 0 || data.length > MAX_PAYLOAD_CHARS) {
          return failBadRequest("data must be a non-empty base64 string under 10 MB");
        }
        if (typeof width !== "number" || !Number.isInteger(width) || width < 1 || width > 16384 || typeof height !== "number" || !Number.isInteger(height) || height < 1 || height > 16384) {
          return failBadRequest("width/height must be integers in [1, 16384]");
        }
        const buffer = Buffer.from(data, "base64");
        if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) return failBadRequest("decoded image is empty or over 8 MB");
        if (!isWebp(buffer)) return failBadRequest("image must be WebP (RIFF....WEBP)");
        const previous = readMeta();
        const revision = (previous?.revision ?? 0) + 1;
        const meta = { revision, width, height, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        const tmp = filePath + ".tmp";
        try {
          writeFileSync(tmp, buffer);
          writeFileSync(metaPath, JSON.stringify(meta));
          renameSync(tmp, filePath);
          await scope.update({ revision, imageWidth: width, imageHeight: height });
        } catch (error) {
          rmSync(tmp, { force: true });
          rmSync(filePath, { force: true });
          rmSync(metaPath, { force: true });
          return failInternal(String(error));
        }
        return ok({ revision, width, height });
      }
      case "remove": {
        try {
          rmSync(filePath, { force: true });
          rmSync(metaPath, { force: true });
          await scope.update({ revision: 0, imageWidth: 0, imageHeight: 0 });
        } catch (error) {
          return failInternal(String(error));
        }
        return ok({ removed: true });
      }
      case "info": {
        return ok(readMeta() ?? { revision: 0 });
      }
      default:
        return failBadRequest('unknown wallpaper endpoint "' + endpoint + '"');
    }
  };
  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: CHANNEL,
    handler: (req, res) => {
      void serveRpc(req, res, dispatch);
    }
  }), "wallpaper: rpc channel");
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: "/plugins/wallpaper/image",
    handler: (req, res) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("method not allowed");
        return;
      }
      let revision;
      try {
        revision = Number(new URL(req.url ?? "/", "http://wallpaper.local").searchParams.get("v"));
      } catch {
        revision = Number.NaN;
      }
      const meta = readMeta();
      const stale = meta === null || meta.revision === 0 || !Number.isInteger(revision) || revision !== meta.revision || !existsSync(filePath);
      if (stale) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("not found");
        return;
      }
      const size = statSync(filePath).size;
      res.writeHead(200, {
        "Content-Type": "image/webp",
        "Content-Length": String(size),
        "Cache-Control": "private, max-age=31536000, immutable"
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      createReadStream(filePath).pipe(res);
    }
  }), "wallpaper: image route");
}
var inject = ["settings", "webServer"];
export {
  apply,
  inject,
  name
};
