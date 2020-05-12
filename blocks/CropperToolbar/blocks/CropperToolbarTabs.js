"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Tabs_1 = __importDefault(require("@material-ui/core/Tabs"));
const Tab_1 = __importDefault(require("@material-ui/core/Tab"));
const makeStyles_1 = __importDefault(require("@material-ui/styles/makeStyles/makeStyles"));
const Crop_1 = __importDefault(require("@material-ui/icons/Crop"));
// import CropperFilterIcon from './CropperFilterIcon';
const CropperColorsIcon_1 = __importDefault(require("../../Icons/CropperColorsIcon"));
// import ResizeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
const useStyles = makeStyles_1.default(() => ({
    tabs: {
        color: 'white',
    },
    tab: {
        '&.MuiTab-root': {
            minWidth: 72,
            marginLeft: 2,
            marginRight: 2,
        },
    },
}), { name: 'Cropper-tabs' });
function CropperToolbarTabs(props) {
    const classes = useStyles();
    const onChange = react_1.default.useCallback((_, v) => {
        if (props.onChange) {
            props.onChange(v);
        }
    }, [props.onChange]);
    return (react_1.default.createElement(Tabs_1.default, { value: props.value, onChange: onChange, textColor: 'inherit', className: classes.tabs },
        react_1.default.createElement(Tab_1.default, { label: 'Crop', icon: react_1.default.createElement(Crop_1.default, null), className: classes.tab }),
        react_1.default.createElement(Tab_1.default, { label: 'Colors', icon: react_1.default.createElement(CropperColorsIcon_1.default, null), className: classes.tab })));
}
exports.default = CropperToolbarTabs;
