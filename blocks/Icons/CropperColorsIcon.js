"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const SvgIcon_1 = __importDefault(require("@material-ui/core/SvgIcon"));
function CropperColorsIcon(props) {
    return (react_1.default.createElement(SvgIcon_1.default, Object.assign({ width: "24", height: "24", viewBox: "0 0 24 24" }, props),
        react_1.default.createElement("g", { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            react_1.default.createElement("path", { d: "M4 1v5.5m0 3.503V23M12 1v10.5m0 3.5v8M20 1v15.5m0 3.5v3M2 7h4M10 12h4M18 17h4" }))));
}
exports.default = react_1.default.memo(CropperColorsIcon);
