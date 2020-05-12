"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CropperRotate_1 = __importDefault(require("./CropperRotate"));
class CropperRotate extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.cursor = null;
        this.onMouseMove = (e) => {
            if (this.cursor !== null) {
                const angle = this.props.value;
                const diff = (this.cursor - e.clientX) / 10;
                const nextAngle = angle + diff;
                // if (nextAngle <= 45 && nextAngle >= -45) {
                this.props.onChange(nextAngle);
                // }
                this.cursor = e.clientX;
            }
        };
        this.onMouseDown = (e) => {
            this.cursor = e.clientX;
        };
        this.clearDragged = () => {
            this.cursor = null;
        };
    }
    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseleave', this.clearDragged);
        document.addEventListener('mouseup', this.clearDragged);
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseleave', this.clearDragged);
        document.removeEventListener('mouseup', this.clearDragged);
    }
    render() {
        return (react_1.default.createElement(CropperRotate_1.default, { angle: this.props.value, onMouseMove: this.onMouseMove, onMouseDown: this.onMouseDown, onMouseUp: this.clearDragged }));
    }
}
exports.default = CropperRotate;
