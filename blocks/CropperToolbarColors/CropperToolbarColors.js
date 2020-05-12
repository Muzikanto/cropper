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
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
const core_1 = require("@material-ui/core");
const StoreConsumer_1 = __importDefault(require("@muzikanto/observable/StoreConsumer"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const styles = () => ({
    root: {
        height: 72,
        display: 'flex',
        justifyContent: 'center',
        color: 'white',
    },
    slider: {
        color: 'white',
        zIndex: 1,
        '& > .MuiTypography-root': {
            fontSize: 14,
        },
        '& > .MuiSlider-root': {
            color: 'white',
        },
    },
});
function SliderWithLabel(_a) {
    var { label, className } = _a, props = __rest(_a, ["label", "className"]);
    return (react_1.default.createElement(Box_1.default, { display: "flex", flexDirection: "column", flex: 1, marginX: 1, alignItems: "center", className: className },
        react_1.default.createElement(core_1.Slider, Object.assign({}, props)),
        react_1.default.createElement(Typography_1.default, null, label)));
}
function CropperToolbarColors(props) {
    const classes = props.classes;
    const store = props.store;
    return (react_1.default.createElement(Toolbar_1.default, { className: classes.root },
        react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.filterBrightness }, (value) => (react_1.default.createElement(SliderWithLabel, { min: 25, max: 175, step: 5, value: value, onChange: (_, v) => {
                props.manager.filterBrightness(v);
            }, className: classes.slider, label: "brightness" }))),
        react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.filterContrast }, (value) => (react_1.default.createElement(SliderWithLabel, { min: 0.25, max: 1.75, step: 0.05, value: value, onChange: (_, v) => {
                props.manager.filterContrast(v);
            }, className: classes.slider, label: "contrast" }))),
        react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.filterSaturate }, (value) => (react_1.default.createElement(SliderWithLabel, { min: 25, max: 175, step: 5, value: value, onChange: (_, v) => {
                props.manager.filterSaturate(v);
            }, className: classes.slider, label: "saturate" }))),
        react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.filterGrayScale }, (value) => (react_1.default.createElement(SliderWithLabel, { min: 0, max: 1, step: 0.05, value: value, onChange: (_, v) => {
                props.manager.filterGrayScale(v);
            }, className: classes.slider, label: "grayscale" }))),
        react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.filterBlur }, (value) => (react_1.default.createElement(SliderWithLabel, { min: 0, max: 3, step: 0.05, value: value, onChange: (_, v) => {
                props.manager.filterBlur(v);
            }, className: classes.slider, label: "blur" })))));
}
exports.default = react_1.default.memo(withStyles_1.default(styles, { name: 'CropperToolbar-colors' })(CropperToolbarColors));
