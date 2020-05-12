"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const clsx_1 = __importDefault(require("clsx"));
const StoreConsumer_1 = __importDefault(require("@muzikanto/observable/StoreConsumer"));
const withStyles_1 = __importDefault(require("@material-ui/styles/withStyles"));
const styles = () => ({
    root: {
        zIndex: 1,
        userSelect: 'none',
        // height: 296,
        margin: '4px 24px 24px 24px',
        position: 'relative',
        cursor: 'move',
    },
    grid: {
        boxSizing: 'border-box',
        position: 'absolute',
        border: 'solid 1px white',
    },
    circle: {
        zIndex: 1,
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleIcon: {
        background: 'white',
        width: 20,
        height: 20,
        borderRadius: '50%',
    },
    line: {
        position: 'absolute',
        background: '#f7f7f799',
    },
    circle_lt: {
        left: 0,
        top: 0,
        transform: 'translate(-50%, -50%)',
        cursor: 'nwse-resize'
    },
    circle_rt: {
        right: 0,
        top: 0,
        transform: 'translate(50%, -50%)',
        cursor: 'nesw-resize'
    },
    circle_lb: {
        left: 0,
        bottom: 0,
        transform: 'translate(-50%, 50%)',
        cursor: 'nesw-resize'
    },
    circle_rb: {
        right: 0,
        bottom: 0,
        transform: 'translate(50%, 50%)',
        cursor: 'nwse-resize'
    },
    size: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        padding: '1px 5px',
        backgroundColor: 'white',
        borderRadius: 3,
        fontSize: 13,
    },
    size_bottom: {
        bottom: -30,
        minWidth: 'max-content',
        right: '50%',
        transform: 'translate(50%, 0)',
    }
});
function CropperGrid(props) {
    const classes = props.classes;
    const onMouseDown = (type) => (e) => {
        props.onMouseDown(type, { x: e.clientX, y: e.clientY });
    };
    const diffHeight = props.rotateToAngle ? 56 : 0;
    return (react_1.default.createElement("div", { className: classes.root, onMouseUp: props.onMouseUp, ref: props.areaRef, style: { height: `calc(100% - ${diffHeight}px - 72px - 24px)` } },
        react_1.default.createElement(StoreConsumer_1.default, { store: props.store, selector: s => s.crop }, (crop) => {
            return (react_1.default.createElement("div", { className: classes.grid, style: {
                    left: crop.x,
                    top: crop.y,
                    width: crop.width,
                    height: crop.height,
                }, ref: props.gridRef },
                react_1.default.createElement(Box_1.default, { className: clsx_1.default(classes.circle, classes.circle_lt), onMouseDown: onMouseDown('lt') },
                    react_1.default.createElement("div", { className: classes.circleIcon })),
                react_1.default.createElement(Box_1.default, { className: clsx_1.default(classes.circle, classes.circle_rt), onMouseDown: onMouseDown('rt') },
                    react_1.default.createElement("div", { className: classes.circleIcon })),
                react_1.default.createElement(Box_1.default, { className: clsx_1.default(classes.circle, classes.circle_lb), onMouseDown: onMouseDown('lb') },
                    react_1.default.createElement("div", { className: classes.circleIcon })),
                react_1.default.createElement(Box_1.default, { className: clsx_1.default(classes.circle, classes.circle_rb), onMouseDown: onMouseDown('rb') },
                    react_1.default.createElement("div", { className: classes.circleIcon })),
                props.sizePreview &&
                    react_1.default.createElement(StoreConsumer_1.default, { store: props.store, selector: s => ({
                            initialZoom: s.initialZoom,
                            zoom: s.zoom,
                            image: s.imageCrop
                        }) }, ({ zoom, image }) => {
                        const imgWidth = image.width * zoom;
                        const imgHeight = image.width * zoom;
                        const w = imgWidth - (imgWidth - crop.width);
                        const h = imgHeight - (imgHeight - crop.height);
                        const width = Math.round(w / zoom);
                        const height = Math.round(h / zoom);
                        return (react_1.default.createElement("div", { className: clsx_1.default(classes.size, { [classes.size_bottom]: crop.width < 100 }) },
                            width,
                            " x ",
                            height));
                    })));
        })));
}
exports.default = react_1.default.memo(withStyles_1.default(styles, { name: 'Cropper-grid' })(CropperGrid));
