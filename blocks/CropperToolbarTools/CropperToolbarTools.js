"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Flip_1 = __importDefault(require("@material-ui/icons/Flip"));
const RotateLeft_1 = __importDefault(require("@material-ui/icons/RotateLeft"));
const StoreConsumer_1 = __importDefault(require("@muzikanto/observable/StoreConsumer"));
const CropperAspectRatio_1 = __importDefault(require("./blocks/CropperAspectRatio"));
const clsx_1 = __importDefault(require("clsx"));
const withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
const styles = () => ({
    root: {
        height: 72,
        display: 'flex',
        justifyContent: 'center',
        color: 'white',
    },
    btn: {
        '&.MuiButton-root': {
            zIndex: 1, color: 'white', marginLeft: 7, marginRight: 7,
            textTransform: 'initial',
        },
    },
});
function CropperToolbarTools(props) {
    const classes = props.classes;
    const store = props.store;
    const rotatedLeft = props.rotatedLeft || props.rotate;
    const rotatedRight = props.rotatedRight || props.rotate;
    const flipX = props.flippedX || props.flipped;
    const flipY = props.flippedY || props.flipped;
    const aspectRatio = Array.isArray(props.aspectRatio) && props.aspectRatio.length > 1;
    return (react_1.default.createElement(Toolbar_1.default, { className: clsx_1.default(classes.root, props.className) },
        rotatedLeft &&
            react_1.default.createElement(Button_1.default, { className: classes.btn, startIcon: react_1.default.createElement(RotateLeft_1.default, null), variant: 'outlined', color: 'inherit', onClick: props.onRotateLeft }, "Rotate left"),
        rotatedRight &&
            react_1.default.createElement(Button_1.default, { className: classes.btn, startIcon: react_1.default.createElement(RotateLeft_1.default, { style: { transform: 'scale(-1, 1)' } }), variant: 'outlined', color: 'inherit', onClick: props.onRotateRight }, "Rotate right"),
        flipX &&
            react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.flipX }, (flipX) => (react_1.default.createElement(Button_1.default, { className: classes.btn, startIcon: react_1.default.createElement(Flip_1.default, { style: { transform: `rotate(${flipX ? 180 : 0}deg)` } }), variant: 'outlined', color: 'inherit', onClick: props.onFlipX }, "Flip horizontal"))),
        flipY &&
            react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.flipY }, (flipY) => (react_1.default.createElement(Button_1.default, { className: classes.btn, startIcon: react_1.default.createElement(Flip_1.default, { style: { transform: `rotate(${flipY ? 270 : 90}deg)` } }), variant: 'outlined', color: 'inherit', onClick: props.onFlipY }, "Flip vertical"))),
        aspectRatio &&
            react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.aspectRatio }, (aspectRatio) => (react_1.default.createElement(CropperAspectRatio_1.default, { value: aspectRatio, onChange: props.onAspectRatio, className: classes.btn, aspectRatio: props.aspectRatio })))));
}
exports.default = react_1.default.memo(withStyles_1.default(styles, { name: 'CropperToolbar-tools' })(CropperToolbarTools));
