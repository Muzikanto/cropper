"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const SvgIcon_1 = __importDefault(require("@material-ui/core/SvgIcon"));
function CropperFilterIcon(props) {
    return (react_1.default.createElement(SvgIcon_1.default, Object.assign({ width: "24", height: "24", viewBox: "0 0 24 24" }, props),
        react_1.default.createElement("g", { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            react_1.default.createElement("path", { d: "M18.347 9.907a6.5 6.5 0 1 0-1.872 3.306M3.26 11.574a6.5 6.5 0 1 0 2.815-1.417" }),
            react_1.default.createElement("path", { d: "M10.15 17.897A6.503 6.503 0 0 0 16.5 23a6.5 6.5 0 1 0-6.183-8.51" }))));
}
exports.default = react_1.default.memo(CropperFilterIcon);
