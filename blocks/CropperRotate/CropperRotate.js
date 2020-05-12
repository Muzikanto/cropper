"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const makeStyles_1 = __importDefault(require("@material-ui/styles/makeStyles/makeStyles"));
const useStyles = makeStyles_1.default(() => ({
    root: {
        height: 56,
        fontSize: 3,
        color: '#ffffff73',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
    },
    scroll: {
        zIndex: 2,
        width: 700,
        overflow: 'hidden',
        mask: 'linear-gradient(90deg,transparent 15%,#000 40%,#000 60%,transparent 85%)',
        userSelect: 'none',
        '&:hover': {
            cursor: 'ew-resize',
        },
        position: 'relative',
    },
    current: {
        top: 0,
        position: 'absolute',
        width: 2,
        height: 10,
        backgroundColor: 'white',
        transform: 'translate(25%, 0)',
        zIndex: 2,
    },
    svg: {
        width: 700,
        position: 'absolute',
        left: 0,
        top: 15,
        transform: 'scale(11)',
        color: '#c7c7c7',
    },
}), { name: 'Cropper-rotate' });
function CropperRotate(props) {
    const classes = useStyles();
    const left = props.angle * -5.335;
    return (react_1.default.createElement(Box_1.default, { className: classes.root },
        react_1.default.createElement("span", { className: classes.current }),
        react_1.default.createElement("div", { className: classes.scroll, onMouseDown: props.onMouseDown, onMouseUp: props.onMouseUp },
            react_1.default.createElement("svg", { viewBox: "-720 -5 1440 10", className: classes.svg, style: { left } }, new Array(80)
                .fill(0)
                .map((_, i) => {
                let v = i * 10 - 400;
                return (react_1.default.createElement(react_1.default.Fragment, { key: 'rotate-dot' + i },
                    react_1.default.createElement("circle", { fill: "currentColor", cx: v, cy: "0", r: "0.5" }),
                    react_1.default.createElement("text", { fill: "currentColor", x: v - 1.5, y: "3.5" },
                        v,
                        "\u00B0"),
                    react_1.default.createElement("circle", { fill: "currentColor", cx: v + 2, cy: "0", r: "0.2" }),
                    react_1.default.createElement("circle", { fill: "currentColor", cx: v + 4, cy: "0", r: "0.2" }),
                    react_1.default.createElement("circle", { fill: "currentColor", cx: v + 6, cy: "0", r: "0.2" }),
                    react_1.default.createElement("circle", { fill: "currentColor", cx: v + 8, cy: "0", r: "0.2" })));
            })))));
}
exports.default = react_1.default.memo(CropperRotate);
