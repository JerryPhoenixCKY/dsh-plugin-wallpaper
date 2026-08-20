window.__ModuleLoader__.load({
  id: "dsh-plugin-wallpaper",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/WallpaperSection.tsx
var import_react2 = require("react");

// src/client/CropDialog.tsx
var import_react = require("react");
var import_react_dom = require("react-dom");

// src/client/WallpaperSection.module.css
var css = "/* Wallpaper settings section + crop dialog (compiled by the plugin build). */\n\n._wp_section_1ahbcuo {\n  flex-direction: column;\n  gap: 16px;\n  width: 100%;\n  display: flex;\n}\n\n._wp_hint_1619p1e {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._wp_warning_vagjeb {\n  color: var(--dsw-alias-state-warn-primary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._wp_error_gesrvl {\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._wp_previewBox_6h2z6u {\n  align-items: center;\n  justify-content: center;\n  background: var(--dsw-alias-bg-layer-1);\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 12px;\n  height: 168px;\n  overflow: hidden;\n  display: flex;\n}\n\n._wp_previewImg_ktltps {\n  height: 100%;\n  object-fit: cover;\n  width: 100%;\n}\n\n._wp_previewEmpty_14w963q {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n}\n\n._wp_hiddenInput_1gg75t1 {\n  display: none;\n}\n\n._wp_actions_5un15g {\n  gap: 8px;\n  display: flex;\n}\n\n._wp_primaryBtn_wmlnkd,\n._wp_ghostBtn_82ouli,\n._wp_dangerBtn_1262xmi {\n  border: 1px solid transparent;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 32px;\n  padding: 0 14px;\n}\n\n._wp_primaryBtn_wmlnkd {\n  background: var(--dsw-alias-brand-primary);\n  color: #fff;\n}\n\n._wp_ghostBtn_82ouli {\n  background: transparent;\n  border-color: var(--dsw-alias-border-l1);\n  color: var(--dsw-alias-label-primary);\n}\n\n._wp_dangerBtn_1262xmi {\n  background: transparent;\n  border-color: var(--dsw-alias-state-error-primary);\n  color: var(--dsw-alias-state-error-primary);\n}\n\n._wp_primaryBtn_wmlnkd:disabled,\n._wp_ghostBtn_82ouli:disabled,\n._wp_dangerBtn_1262xmi:disabled {\n  cursor: not-allowed;\n  opacity: 0.45;\n}\n\n._wp_checkRow_xa773p {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n  font-size: 13px;\n}\n\n._wp_checkRow_xa773p input,\n._wp_select_zz8vbl {\n  accent-color: var(--dsw-alias-brand-primary);\n}\n\n._wp_row_duz5mb {\n  align-items: center;\n  gap: 10px;\n  display: flex;\n}\n\n._wp_controlLabel_7tzdw8 {\n  color: var(--dsw-alias-label-primary);\n  flex: none;\n  font-size: 13px;\n  width: 108px;\n}\n\n._wp_controlValue_rtu251 {\n  color: var(--dsw-alias-label-secondary);\n  flex: none;\n  font-size: 12px;\n  width: 40px;\n}\n\n._wp_select_zz8vbl {\n  background: var(--dsw-alias-bg-layer-1);\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 30px;\n  padding: 0 8px;\n}\n\n._wp_range_1cls98m {\n  flex: 1;\n}\n\n/* \u2500\u2500 crop dialog \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n._wp_backdrop_1723xjv {\n  align-items: center;\n  background: rgba(0, 0, 0, 0.55);\n  inset: 0;\n  justify-content: center;\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n}\n\n._wp_cropDialog_1cb7jcv {\n  background: var(--dsw-alias-bg-overlay);\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 12px;\n  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);\n  color: var(--dsw-alias-label-primary);\n  flex-direction: column;\n  gap: 12px;\n  max-height: calc(100vh - 48px);\n  padding: 16px;\n  width: min(920px, calc(100vw - 48px));\n  display: flex;\n}\n\n._wp_cropTitle_hwkafr {\n  font-size: 15px;\n  font-weight: 600;\n}\n\n._wp_cropStageWrap_1tinx2f {\n  background: #000;\n  border-radius: 8px;\n  height: min(56vh, 520px);\n  overflow: hidden;\n  position: relative;\n  touch-action: none;\n}\n\n._wp_cropStageImg_miwr0w {\n  max-width: none;\n  pointer-events: none;\n  position: absolute;\n  user-select: none;\n}\n\n._wp_cropBox_ac25aa {\n  border: 2px solid #fff;\n  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45);\n  cursor: move;\n  position: absolute;\n}\n\n._wp_cropHandle_guc0xp {\n  background: #fff;\n  border-radius: 2px;\n  height: 12px;\n  position: absolute;\n  transform: translate(-50%, -50%);\n  width: 12px;\n}\n\n._wp_cropHandleNW_ogji3o { left: 0; top: 0; cursor: nwse-resize; }\n._wp_cropHandleN_1vo1x5f { left: 50%; top: 0; cursor: ns-resize; }\n._wp_cropHandleNE_gl8cxi { left: 100%; top: 0; cursor: nesw-resize; }\n._wp_cropHandleE_19uywuw { left: 100%; top: 50%; cursor: ew-resize; }\n._wp_cropHandleSE_1g5e32j { left: 100%; top: 100%; cursor: nwse-resize; }\n._wp_cropHandleS_1wvg1ce { left: 50%; top: 100%; cursor: ns-resize; }\n._wp_cropHandleSW_dnmsk9 { left: 0; top: 100%; cursor: nesw-resize; }\n._wp_cropHandleW_1fdb4qy { left: 0; top: 50%; cursor: ew-resize; }\n\n._wp_cropControls_13ukfnn {\n  align-items: center;\n  gap: 10px;\n  display: flex;\n}\n\n._wp_cropHint_1b6ngx8 {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._wp_footer_14gp4v0 {\n  gap: 8px;\n  justify-content: flex-end;\n  display: flex;\n}\n";
var tagId = "dsh-plugin-wallpaper/src/client/WallpaperSection.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
  tag = document.createElement("style");
  tag.dataset.plugin = "dsh-plugin-wallpaper";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
var tag;
var WallpaperSection_default = { "section": "_wp_section_1ahbcuo", "hint": "_wp_hint_1619p1e", "warning": "_wp_warning_vagjeb", "error": "_wp_error_gesrvl", "previewBox": "_wp_previewBox_6h2z6u", "previewImg": "_wp_previewImg_ktltps", "previewEmpty": "_wp_previewEmpty_14w963q", "hiddenInput": "_wp_hiddenInput_1gg75t1", "actions": "_wp_actions_5un15g", "primaryBtn": "_wp_primaryBtn_wmlnkd", "ghostBtn": "_wp_ghostBtn_82ouli", "dangerBtn": "_wp_dangerBtn_1262xmi", "checkRow": "_wp_checkRow_xa773p", "select": "_wp_select_zz8vbl", "row": "_wp_row_duz5mb", "controlLabel": "_wp_controlLabel_7tzdw8", "controlValue": "_wp_controlValue_rtu251", "range": "_wp_range_1cls98m", "backdrop": "_wp_backdrop_1723xjv", "cropDialog": "_wp_cropDialog_1cb7jcv", "cropTitle": "_wp_cropTitle_hwkafr", "cropStageWrap": "_wp_cropStageWrap_1tinx2f", "cropStageImg": "_wp_cropStageImg_miwr0w", "cropBox": "_wp_cropBox_ac25aa", "cropHandle": "_wp_cropHandle_guc0xp", "cropHandleNW": "_wp_cropHandleNW_ogji3o", "cropHandleN": "_wp_cropHandleN_1vo1x5f", "cropHandleNE": "_wp_cropHandleNE_gl8cxi", "cropHandleE": "_wp_cropHandleE_19uywuw", "cropHandleSE": "_wp_cropHandleSE_1g5e32j", "cropHandleS": "_wp_cropHandleS_1wvg1ce", "cropHandleSW": "_wp_cropHandleSW_dnmsk9", "cropHandleW": "_wp_cropHandleW_1fdb4qy", "cropControls": "_wp_cropControls_13ukfnn", "cropHint": "_wp_cropHint_1b6ngx8", "footer": "_wp_footer_14gp4v0" };

// src/client/CropDialog.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var MAX_EXPORT_EDGE = 2560;
var MIN_CROP = 0.08;
var HANDLE_HIT = 14;
var HANDLES = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w"
];
function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}
function containRect(stageW, stageH, natW, natH) {
  if (stageW <= 0 || stageH <= 0 || natW <= 0 || natH <= 0) return { x: 0, y: 0, w: stageW, h: stageH };
  const scale = Math.min(stageW / natW, stageH / natH);
  const w = natW * scale;
  const h = natH * scale;
  return { x: (stageW - w) / 2, y: (stageH - h) / 2, w, h };
}
function initialCrop(natW, natH, targetAspect, locked) {
  const imgAspect = natW / natH;
  let w = 1;
  let h = 1;
  if (locked) {
    if (imgAspect > targetAspect) {
      h = 1;
      w = targetAspect / imgAspect;
    } else {
      w = 1;
      h = imgAspect / targetAspect;
    }
  }
  const INSET = 0.08;
  w = Math.max(MIN_CROP, w * (1 - 2 * INSET));
  h = Math.max(MIN_CROP, h * (1 - 2 * INSET));
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
}
function renderCropped(image, natural, blur) {
  const scale = Math.min(1, MAX_EXPORT_EDGE / Math.max(natural.w, natural.h));
  const tw = Math.max(1, Math.round(natural.w * scale));
  const th = Math.max(1, Math.round(natural.h * scale));
  const out = document.createElement("canvas");
  out.width = tw;
  out.height = th;
  const ctx = out.getContext("2d");
  if (!ctx) return Promise.reject(new Error("canvas unavailable"));
  if (blur > 0) {
    const pass = document.createElement("canvas");
    pass.width = Math.max(1, Math.round(natural.w));
    pass.height = Math.max(1, Math.round(natural.h));
    const passCtx = pass.getContext("2d");
    if (!passCtx) return Promise.reject(new Error("canvas unavailable"));
    passCtx.filter = "blur(" + blur * scale + "px)";
    passCtx.drawImage(image, natural.x, natural.y, natural.w, natural.h, 0, 0, pass.width, pass.height);
    ctx.drawImage(pass, 0, 0, pass.width, pass.height, 0, 0, tw, th);
  } else {
    ctx.drawImage(image, natural.x, natural.y, natural.w, natural.h, 0, 0, tw, th);
  }
  return new Promise((resolve, reject) => {
    out.toBlob((blob) => blob ? resolve(blob) : reject(new Error("webp encode failed")), "image/webp", 0.85);
  });
}
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const comma = dataUrl.indexOf(",");
      resolve(comma >= 0 ? dataUrl.slice(comma + 1) : "");
    };
    reader.onerror = () => reject(new Error("file read failed"));
    reader.readAsDataURL(blob);
  });
}
function CropDialog(props) {
  const { file, t, onClose, onConfirm } = props;
  const [blur, setBlur] = (0, import_react.useState)(0);
  const [lockAspect, setLockAspect] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [nat, setNat] = (0, import_react.useState)(null);
  const [stage, setStage] = (0, import_react.useState)({ w: 0, h: 0 });
  const [crop, setCrop] = (0, import_react.useState)(null);
  const stageRef = (0, import_react.useRef)(null);
  const dragRef = (0, import_react.useRef)(null);
  const objectUrl = (0, import_react.useMemo)(() => URL.createObjectURL(file), [file]);
  const targetAspect = (0, import_react.useMemo)(() => {
    const ratio = window.innerWidth / Math.max(1, window.innerHeight);
    return clamp(ratio, 0.4, 3.2);
  }, []);
  (0, import_react.useEffect)(() => () => URL.revokeObjectURL(objectUrl), [objectUrl]);
  (0, import_react.useEffect)(() => {
    const node = stageRef.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setStage({ w: rect.width, h: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (nat === null || stage.w <= 0 || stage.h <= 0 || crop !== null) return;
    setCrop(initialCrop(nat.w, nat.h, targetAspect, lockAspect));
  }, [nat, stage, crop, lockAspect, targetAspect]);
  const disp = nat === null ? null : containRect(stage.w, stage.h, nat.w, nat.h);
  const onStagePointerDown = (event) => {
    if (crop === null || disp === null || nat === null) return;
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = event.clientX - rect.left - disp.x;
    const py = event.clientY - rect.top - disp.y;
    const box = { x: crop.x * disp.w, y: crop.y * disp.h, w: crop.w * disp.w, h: crop.h * disp.h };
    const handle = HANDLES.find((id) => {
      const hp = handlePoint(id, box);
      return Math.abs(px - (box.x + hp.x)) <= HANDLE_HIT && Math.abs(py - (box.y + hp.y)) <= HANDLE_HIT;
    });
    if (handle !== void 0) {
      dragRef.current = { mode: "resize", handle, startX: event.clientX, startY: event.clientY, startCrop: { ...crop } };
      event.preventDefault();
      node.setPointerCapture(event.pointerId);
      return;
    }
    if (px >= box.x - HANDLE_HIT && px <= box.x + box.w + HANDLE_HIT && py >= box.y - HANDLE_HIT && py <= box.y + box.h + HANDLE_HIT) {
      dragRef.current = { mode: "move", handle: "se", startX: event.clientX, startY: event.clientY, startCrop: { ...crop } };
      event.preventDefault();
      node.setPointerCapture(event.pointerId);
    }
  };
  const onStagePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || crop === null || disp === null) return;
    const dx = (event.clientX - drag.startX) / Math.max(1, disp.w);
    const dy = (event.clientY - drag.startY) / Math.max(1, disp.h);
    const boxAspect = targetAspect * disp.h / Math.max(1, disp.w);
    const next = resizeCrop(drag.startCrop, drag.mode, drag.handle, dx, dy, lockAspect ? boxAspect : null);
    setCrop(next);
    event.preventDefault();
  };
  const endDrag = (event) => {
    const node = stageRef.current;
    if (node && node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  };
  const handleConfirm = (0, import_react.useCallback)(async () => {
    if (crop === null || nat === null || busy) return;
    setBusy(true);
    setError(null);
    try {
      const img = new Image();
      img.src = objectUrl;
      await img.decode();
      const natural = {
        x: crop.x * nat.w,
        y: crop.y * nat.h,
        w: crop.w * nat.w,
        h: crop.h * nat.h
      };
      const blob = await renderCropped(img, natural, blur);
      const base64 = await blobToBase64(blob);
      const scale = Math.min(1, MAX_EXPORT_EDGE / Math.max(natural.w, natural.h));
      onConfirm({ base64, width: Math.max(1, Math.round(natural.w * scale)), height: Math.max(1, Math.round(natural.h * scale)), blur });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  }, [crop, nat, objectUrl, blur, busy, onConfirm]);
  const dialog = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: WallpaperSection_default.backdrop, onPointerDown: (event) => {
    if (event.target === event.currentTarget) onClose();
  }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: WallpaperSection_default.cropDialog, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: WallpaperSection_default.cropTitle, children: t("cropTitle") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: WallpaperSection_default.cropStageWrap,
        ref: stageRef,
        onPointerDown: onStagePointerDown,
        onPointerMove: onStagePointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "img",
            {
              className: WallpaperSection_default.cropStageImg,
              src: objectUrl,
              alt: "",
              draggable: false,
              onLoad: (event) => setNat({ w: event.currentTarget.naturalWidth, h: event.currentTarget.naturalHeight }),
              onError: () => setError(t("invalidImage")),
              style: disp === null ? { visibility: "hidden" } : { left: disp.x, top: disp.y, width: disp.w, height: disp.h }
            }
          ),
          crop !== null && disp !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: WallpaperSection_default.cropBox,
              style: { left: disp.x + crop.x * disp.w, top: disp.y + crop.y * disp.h, width: crop.w * disp.w, height: crop.h * disp.h },
              children: HANDLES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: WallpaperSection_default.cropHandle + " " + WallpaperSection_default["cropHandle" + id.toUpperCase()] }, id))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: WallpaperSection_default.cropControls, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: WallpaperSection_default.controlLabel, children: [
        t("cropBlur"),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: WallpaperSection_default.controlValue, children: [
          Math.round(blur),
          "px"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: WallpaperSection_default.range, type: "range", min: 0, max: 20, step: 1, value: blur, onChange: (event) => setBlur(Number(event.target.value)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: WallpaperSection_default.checkRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "checkbox", checked: lockAspect, onChange: (event) => setLockAspect(event.target.checked) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("lockAspect") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: WallpaperSection_default.cropHint, children: t("cropHint") }),
    error !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: WallpaperSection_default.error, children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: WallpaperSection_default.footer, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: WallpaperSection_default.ghostBtn, onClick: onClose, children: t("cropCancel") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: WallpaperSection_default.primaryBtn, disabled: busy || crop === null, onClick: () => void handleConfirm(), children: busy ? t("applying") : t("cropApply") })
    ] })
  ] }) });
  return (0, import_react_dom.createPortal)(dialog, document.body);
}
function handlePoint(id, box) {
  const right = id.includes("e");
  const bottom = id.includes("s");
  const mid = !right && !id.includes("w");
  const midY = !bottom && !id.includes("n");
  return {
    x: right ? box.w : mid ? box.w / 2 : 0,
    y: bottom ? box.h : midY ? box.h / 2 : 0
  };
}
function resizeCrop(start, mode, handle, dx, dy, aspect) {
  if (mode === "move") {
    return {
      x: clamp(start.x + dx, 0, 1 - start.w),
      y: clamp(start.y + dy, 0, 1 - start.h),
      w: start.w,
      h: start.h
    };
  }
  const left = handle.includes("w");
  const right = handle.includes("e");
  const top = handle.includes("n");
  const bottom = handle.includes("s");
  if ((left || right) && (top || bottom)) {
    const fx2 = right ? start.x : start.x + start.w;
    const fy = bottom ? start.y : start.y + start.h;
    const mx = start.x + (right ? start.w : 0) + dx;
    const my = start.y + (bottom ? start.h : 0) + dy;
    let w2 = clamp(right ? mx - fx2 : fx2 - mx, MIN_CROP, 1);
    let h2 = clamp(bottom ? my - fy : fy - my, MIN_CROP, 1);
    if (aspect !== null) {
      h2 = w2 / aspect;
      const hMax = top ? fy : 1 - fy;
      if (h2 > hMax) {
        h2 = hMax;
        w2 = h2 * aspect;
      }
      if (h2 < MIN_CROP) {
        h2 = MIN_CROP;
        w2 = h2 * aspect;
      }
    }
    const x2 = right ? fx2 : fx2 - w2;
    const y = bottom ? fy : fy - h2;
    return { x: clamp(x2, 0, 1 - w2), y: clamp(y, 0, 1 - h2), w: w2, h: h2 };
  }
  if (top || bottom) {
    const fy = bottom ? start.y : start.y + start.h;
    let h2 = clamp(bottom ? start.h + dy : start.h - dy, MIN_CROP, 1);
    const cx = start.x + start.w / 2;
    let w2 = aspect !== null ? h2 * aspect : start.w;
    w2 = clamp(w2, MIN_CROP, Math.min(2 * cx, 2 * (1 - cx), 1));
    if (aspect !== null) h2 = w2 / aspect;
    const y = bottom ? start.y : fy - h2;
    return { x: clamp(cx - w2 / 2, 0, 1 - w2), y: clamp(y, 0, 1 - h2), w: w2, h: h2 };
  }
  const fx = right ? start.x : start.x + start.w;
  let w = clamp(right ? start.w + dx : start.w - dx, MIN_CROP, 1);
  const cy = start.y + start.h / 2;
  let h = aspect !== null ? w / aspect : start.h;
  h = clamp(h, MIN_CROP, Math.min(2 * cy, 2 * (1 - cy), 1));
  if (aspect !== null) w = h * aspect;
  const x = right ? start.x : fx - w;
  return { x: clamp(x, 0, 1 - w), y: clamp(cy - h / 2, 0, 1 - h), w, h };
}

// src/client/settings.ts
var WALLPAPER_NS = "wallpaper";
function imageUrl(revision) {
  return "/plugins/wallpaper/image?v=" + revision;
}

// src/client/WallpaperSection.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var FIT_OPTIONS = ["cover", "contain", "center", "stretch"];
var FIT_KEYS = {
  cover: "fitCover",
  contain: "fitContain",
  center: "fitCenter",
  stretch: "fitStretch"
};
function useStore(store) {
  return (0, import_react2.useSyncExternalStore)(store.subscribe, store.getSnapshot);
}
function WallpaperSection(props) {
  const { store, rpc, isLoopback, t } = props;
  const snapshot = useStore(store);
  const settings = snapshot.value;
  const [cropFile, setCropFile] = (0, import_react2.useState)(null);
  const [busy, setBusy] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const fileInputRef = (0, import_react2.useRef)(null);
  const uploadable = isLoopback;
  const pickFile = (file) => {
    if (file === null) return;
    if (!uploadable) {
      setError(t("remoteWarning"));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError(t("tooLarge"));
      return;
    }
    setError(null);
    setCropFile(file);
  };
  const handleConfirm = async (payload) => {
    setCropFile(null);
    setBusy(true);
    setError(null);
    try {
      const result = await rpc.call("/wallpaper", "put", {
        data: payload.base64,
        width: payload.width,
        height: payload.height
      });
      if (!result.ok) throw new Error(result.error.message);
      await store.load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };
  const handleRemove = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await rpc.call("/wallpaper", "remove", {});
      if (!result.ok) throw new Error(result.error.message);
      await store.load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };
  if (snapshot.status === "loading") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: WallpaperSection_default.hint, children: t("loading") });
  }
  if (snapshot.status === "unavailable" || settings === void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: WallpaperSection_default.hint, children: t("unavailable") });
  }
  const hasImage = settings.revision > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: WallpaperSection_default.section, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: WallpaperSection_default.hint, children: t("hint") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: WallpaperSection_default.previewBox, children: hasImage ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { className: WallpaperSection_default.previewImg, src: imageUrl(settings.revision), alt: "" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: WallpaperSection_default.previewEmpty, children: t("previewEmpty") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        className: WallpaperSection_default.hiddenInput,
        onChange: (event) => {
          pickFile(event.target.files?.[0] ?? null);
          event.target.value = "";
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: WallpaperSection_default.actions, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: WallpaperSection_default.primaryBtn, disabled: !uploadable || busy, onClick: () => fileInputRef.current?.click(), children: hasImage ? t("replaceButton") : t("uploadButton") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: WallpaperSection_default.dangerBtn, disabled: !uploadable || busy || !hasImage, onClick: () => void handleRemove(), children: t("removeButton") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: WallpaperSection_default.checkRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "checkbox", checked: settings.enabled, onChange: (event) => void store.set({ enabled: event.target.checked }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t("enabledLabel") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: WallpaperSection_default.row, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: WallpaperSection_default.controlLabel, children: t("fitLabel") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("select", { className: WallpaperSection_default.select, value: settings.fit, onChange: (event) => void store.set({ fit: event.target.value }), children: FIT_OPTIONS.map((fit) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: fit, children: t(FIT_KEYS[fit]) }, fit)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: WallpaperSection_default.row, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: WallpaperSection_default.controlLabel, children: t("panelLabel") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          className: WallpaperSection_default.range,
          type: "range",
          min: 0,
          max: 100,
          value: Math.round(settings.panelOpacity * 100),
          onChange: (event) => void store.set({ panelOpacity: Number(event.target.value) / 100 })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: WallpaperSection_default.controlValue, children: [
        Math.round(settings.panelOpacity * 100),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: WallpaperSection_default.row, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: WallpaperSection_default.controlLabel, children: t("overlayLabel") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          className: WallpaperSection_default.range,
          type: "range",
          min: 0,
          max: 100,
          value: Math.round(settings.overlayOpacity * 100),
          onChange: (event) => void store.set({ overlayOpacity: Number(event.target.value) / 100 })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: WallpaperSection_default.controlValue, children: [
        Math.round(settings.overlayOpacity * 100),
        "%"
      ] })
    ] }),
    !isLoopback && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: WallpaperSection_default.warning, children: t("remoteWarning") }),
    error !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: WallpaperSection_default.error, children: error }),
    busy && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: WallpaperSection_default.hint, children: t("applying") }),
    cropFile !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      CropDialog,
      {
        file: cropFile,
        t,
        onClose: () => setCropFile(null),
        onConfirm: (payload) => void handleConfirm(payload)
      }
    )
  ] });
}

// src/client/color.ts
function clamp2(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}
function parseColor(color) {
  const c = color.trim();
  let m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(c);
  if (m) {
    return [clamp2(Number(m[1]), 0, 255), clamp2(Number(m[2]), 0, 255), clamp2(Number(m[3]), 0, 255), m[4] === void 0 ? 1 : clamp2(Number(m[4]), 0, 1)];
  }
  m = /^#([0-9a-f]{3,8})$/i.exec(c);
  if (m) {
    const hex = m[1];
    const full = hex.length === 3 || hex.length === 4 ? hex.split("").map((d) => d + d).join("") : hex;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    const a = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
  }
  return null;
}
function withAlpha(color, alpha) {
  const parsed = parseColor(color);
  if (parsed) {
    return "rgba(" + Math.round(parsed[0]) + ", " + Math.round(parsed[1]) + ", " + Math.round(parsed[2]) + ", " + Math.round(clamp2(alpha, 0, 1) * 1e3) / 1e3 + ")";
  }
  return "color-mix(in srgb, " + color + " " + Math.round(clamp2(alpha, 0, 1) * 100) + "%, transparent)";
}

// src/client/background.ts
var PANEL_VARS = [
  "--dsw-alias-bg-base",
  "--dsw-alias-bg-layer-1",
  "--dsw-alias-bg-layer-2",
  "--dsw-specific-sidebar-fill",
  "--dsw-alias-bg-module-platform"
];
var BG_TAG = "dsh-plugin-wallpaper:background";
function bgSize(fit) {
  if (fit === "stretch") return "100% 100%";
  if (fit === "center") return "auto";
  return fit;
}
function attachBackground(ctx, store) {
  let disposed = false;
  const style = (() => {
    const found = document.querySelector('style[data-plugin-css="' + BG_TAG + '"]');
    if (found instanceof HTMLStyleElement) return found;
    const tag2 = document.createElement("style");
    tag2.dataset.plugin = "dsh-plugin-wallpaper";
    tag2.dataset.pluginCss = BG_TAG;
    document.head.appendChild(tag2);
    return tag2;
  })();
  const readOriginals = () => {
    style.textContent = "";
    const originals = {};
    for (const name of PANEL_VARS) {
      const value = getComputedStyle(document.body).getPropertyValue(name).trim();
      if (value !== "") originals[name] = value;
    }
    return originals;
  };
  const paint = () => {
    if (disposed) return;
    const snapshot = store.getSnapshot();
    const settings = snapshot.value;
    const active = snapshot.status === "ready" && settings !== void 0 && settings.enabled && settings.revision > 0;
    if (!active) {
      style.textContent = "";
      return;
    }
    const originals = readOriginals();
    const theme = ctx.theme.getTheme();
    const scheme = theme.active?.colorScheme === "dark" ? "dark" : "light";
    const scrim = scheme === "dark" ? "0, 0, 0" : "255, 255, 255";
    const lines = ["body {"];
    for (const name of PANEL_VARS) {
      const original = originals[name];
      if (original === void 0) continue;
      lines.push("  " + name + ": " + withAlpha(original, settings.panelOpacity) + " !important;");
    }
    const base = originals["--dsw-alias-bg-base"];
    if (base !== void 0) lines.push("  background-color: " + base + " !important;");
    lines.push("  background-image: linear-gradient(rgba(" + scrim + ", " + settings.overlayOpacity + "), rgba(" + scrim + ", " + settings.overlayOpacity + ')), url("' + imageUrl(settings.revision) + '") !important;');
    lines.push("  background-size: " + bgSize(settings.fit) + " !important;");
    lines.push("  background-position: center !important;");
    lines.push("  background-repeat: no-repeat !important;");
    lines.push("  background-attachment: fixed !important;");
    lines.push("}");
    style.textContent = lines.join("\n");
  };
  const unsubscribe = store.subscribe(() => {
    if (!disposed) paint();
  });
  const offTheme = ctx.on("theme/change", () => {
    if (!disposed) requestAnimationFrame(() => paint());
  });
  paint();
  return () => {
    disposed = true;
    unsubscribe();
    offTheme();
    style.textContent = "";
    style.remove();
  };
}

// src/client/store.ts
var WallpaperStore = class {
  constructor(rpc) {
    this.rpc = rpc;
  }
  rpc;
  snapshot = { status: "loading" };
  listeners = /* @__PURE__ */ new Set();
  dirty = null;
  flushing = false;
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getSnapshot = () => this.snapshot;
  publish(snapshot) {
    this.snapshot = snapshot;
    for (const listener of [...this.listeners]) listener();
  }
  /** Pull the host-resolved config once (plugin activation / after uploads). */
  async load() {
    const result = await this.rpc.call("/wallpaper", "config/get", {});
    if (!result.ok) {
      this.publish({ status: "unavailable" });
      return;
    }
    this.publish({ status: "ready", value: result.value });
  }
  /**
   * Coalescing writer: rapid slider writes merge; only the newest patch
   * re-flushes after the in-flight round-trip, so the host never races
   * itself and the UI never blocks on intermediate responses.
   */
  async set(patch) {
    this.dirty = { ...this.dirty, ...patch };
    if (this.flushing) return;
    this.flushing = true;
    try {
      while (this.dirty !== null) {
        const next = this.dirty;
        this.dirty = null;
        const result = await this.rpc.call("/wallpaper", "config/set", { patch: next });
        if (!result.ok) throw new Error(result.error.message);
        this.publish({ status: "ready", value: result.value });
      }
    } finally {
      this.flushing = false;
    }
  }
};

// src/client/index.tsx
var zh = {
  nav: "\u80CC\u666F",
  hint: "\u4E0A\u4F20\u4E00\u5F20\u672C\u5730\u56FE\u7247\u5E76\u88C1\u5207\uFF0C\u4F5C\u4E3A\u5DE5\u4F5C\u53F0\u7684\u684C\u9762\u80CC\u666F\u3002",
  previewEmpty: "\u5C1A\u672A\u8BBE\u7F6E\u80CC\u666F",
  uploadButton: "\u4E0A\u4F20\u56FE\u7247",
  replaceButton: "\u66F4\u6362\u56FE\u7247",
  removeButton: "\u79FB\u9664\u80CC\u666F",
  enabledLabel: "\u542F\u7528\u80CC\u666F",
  fitLabel: "\u586B\u5145\u65B9\u5F0F",
  fitCover: "\u94FA\u6EE1\uFF08cover\uFF09",
  fitContain: "\u5B8C\u6574\u663E\u793A\uFF08contain\uFF09",
  fitCenter: "\u5C45\u4E2D\u539F\u59CB\u5927\u5C0F",
  fitStretch: "\u62C9\u4F38\u94FA\u6EE1",
  panelLabel: "\u9762\u677F\u4E0D\u900F\u660E\u5EA6",
  overlayLabel: "\u906E\u7F69\u4E0D\u900F\u660E\u5EA6",
  cropTitle: "\u88C1\u5207\u56FE\u7247",
  cropHint: "\u62D6\u52A8\u9009\u6846\u79FB\u52A8\uFF0C\u62D6\u62FD\u8FB9\u89D2\u8C03\u6574\u5927\u5C0F\u3002\u9ED8\u8BA4\u9501\u5B9A\u4E3A\u5F53\u524D\u5DE5\u4F5C\u53F0\u7684\u5BBD\u9AD8\u6BD4\u3002",
  cropBlur: "\u80CC\u666F\u6A21\u7CCA",
  lockAspect: "\u9501\u5B9A\u5DE5\u4F5C\u53F0\u5BBD\u9AD8\u6BD4",
  cropApply: "\u5E94\u7528\u4E3A\u80CC\u666F",
  cropCancel: "\u53D6\u6D88",
  applying: "\u6B63\u5728\u5E94\u7528\u2026",
  loading: "\u6B63\u5728\u8BFB\u53D6\u8BBE\u7F6E\u2026",
  unavailable: "\u65E0\u6CD5\u8BFB\u53D6\u80CC\u666F\u8BBE\u7F6E\u3002",
  remoteWarning: "\u5F53\u524D\u9875\u9762\u5E76\u975E\u672C\u673A\u8BBF\u95EE\uFF0C\u65E0\u6CD5\u4E0A\u4F20\u56FE\u7247\uFF08\u4EC5\u672C\u673A\u53EF\u5199\u5165\uFF09\u3002",
  tooLarge: "\u56FE\u7247\u8FC7\u5927\uFF0C\u8BF7\u9009\u62E9 20 MB \u4EE5\u5185\u7684\u6587\u4EF6\u3002",
  invalidImage: "\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u56FE\u7247\u6587\u4EF6\u3002"
};
var en = {
  nav: "Wallpaper",
  hint: "Upload a local image and crop it as the workspace desktop background.",
  previewEmpty: "No wallpaper set",
  uploadButton: "Upload image",
  replaceButton: "Replace image",
  removeButton: "Remove wallpaper",
  enabledLabel: "Enable wallpaper",
  fitLabel: "Fit",
  fitCover: "Cover",
  fitContain: "Contain",
  fitCenter: "Center (original size)",
  fitStretch: "Stretch",
  panelLabel: "Panel opacity",
  overlayLabel: "Overlay dimming",
  cropTitle: "Crop image",
  cropHint: "Drag to move the box, drag a corner or edge to resize. Aspect is locked to the workspace by default.",
  cropBlur: "Blur",
  lockAspect: "Lock workspace aspect ratio",
  cropApply: "Apply as background",
  cropCancel: "Cancel",
  applying: "Applying\u2026",
  loading: "Loading settings\u2026",
  unavailable: "Wallpaper settings are unavailable.",
  remoteWarning: "This page is not opened from this machine; uploading is unavailable (writes are loopback-only).",
  tooLarge: "The image is too large; pick a file under 20 MB.",
  invalidImage: "Could not read this image file."
};
var inject = ["slots", "locale", "connection", "theme"];
function apply(ctx) {
  const connection = ctx.get("connection");
  const store = new WallpaperStore(connection.rpc);
  ctx.effect(() => ctx.locale.register(WALLPAPER_NS, { zh, en }), "wallpaper: dictionaries");
  const translate = ctx.locale.bind(WALLPAPER_NS);
  const t = (key) => translate(key);
  void store.load();
  ctx.effect(() => attachBackground(ctx, store), "wallpaper: background");
  const injected = () => ({
    store,
    rpc: connection.rpc,
    isLoopback: connection.isLoopback,
    t
  });
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "wallpaper",
    order: 30,
    label: () => t("nav"),
    inject: injected
  }, WallpaperSection));
}

    return module.exports;
  }
});
