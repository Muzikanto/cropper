"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function CropperTab(props) {
    const { children, value, tab } = props, other = __rest(props, ["children", "value", "tab"]);
    return (react_1.default.createElement("div", Object.assign({ role: "tab-panel", hidden: tab !== value, "aria-labelledby": `simple-tab-${value}`, style: { height: 'calc(100% - 76px)' } }, other), children));
}
exports.default = CropperTab;
