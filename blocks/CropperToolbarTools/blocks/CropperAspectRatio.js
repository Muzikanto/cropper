"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Popover_1 = __importDefault(require("@material-ui/core/Popover"));
const react_1 = __importDefault(require("react"));
const CropFree_1 = __importDefault(require("@material-ui/icons/CropFree"));
const CropLandscape_1 = __importDefault(require("@material-ui/icons/CropLandscape"));
const CropPortrait_1 = __importDefault(require("@material-ui/icons/CropPortrait"));
const CropSquare_1 = __importDefault(require("@material-ui/icons/CropSquare"));
const AspectRatio_1 = __importDefault(require("@material-ui/icons/AspectRatio"));
const makeStyles_1 = __importDefault(require("@material-ui/styles/makeStyles/makeStyles"));
const clsx_1 = __importDefault(require("clsx"));
const useStyles = makeStyles_1.default(() => ({
    popover: {
        marginTop: 3,
        '& > .MuiPaper-root': {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    btn: {
        '&.MuiButton-root': {
            justifyContent: 'flex-start',
            width: '100%',
            '& > .MuiButton-label': {
                '& > span': {
                    padding: 4,
                },
            },
        },
    },
    current: {
        '&.MuiButton-root': {
            backgroundColor: '#62626257',
        },
    },
}), { name: 'Cropper-aspectRatio' });
const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
};
const transformOrigin = {
    vertical: 'top',
    horizontal: 'center',
};
const mapValues = {
    square: 1,
    landscape: 16 / 10,
    portrait: 10 / 16,
    free: false,
};
exports.getDefaultAspectRatio = (value) => {
    if (!value) {
        return false;
    }
    if (typeof value === 'number') {
        return value;
    }
    const first = value[0];
    if (typeof first === 'string') {
        return mapValues[first];
    }
    else {
        return first.value;
    }
};
const mapRenders = {
    free: {
        icon: react_1.default.createElement(CropFree_1.default, null),
        value: false,
        label: 'Free',
    },
    landscape: {
        icon: react_1.default.createElement(CropLandscape_1.default, null),
        value: 16 / 10,
        label: 'Landscape',
    },
    portrait: {
        icon: react_1.default.createElement(CropPortrait_1.default, null),
        value: 10 / 16,
        label: 'Portrait',
    },
    square: {
        icon: react_1.default.createElement(CropSquare_1.default, null),
        value: 1,
        label: 'Square',
    },
};
function CropperAspectRatio(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = react_1.default.useState(null);
    const onOpen = (e) => setAnchorEl(e.currentTarget);
    const onClose = () => setAnchorEl(null);
    const onChange = react_1.default.useCallback((value) => {
        if (props.onChange) {
            props.onChange(value);
        }
        onClose();
    }, [props.onChange]);
    if (!Array.isArray(props.aspectRatio)) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Button_1.default, { className: props.className, startIcon: react_1.default.createElement(AspectRatio_1.default, null), variant: 'outlined', color: 'inherit', onClick: onOpen }, "Aspect ratio"),
        react_1.default.createElement(Popover_1.default, { open: Boolean(anchorEl), anchorEl: anchorEl, onClose: onClose, anchorOrigin: anchorOrigin, transformOrigin: transformOrigin, className: classes.popover }, props.aspectRatio
            .map((el) => {
            if (typeof el === "string") {
                return mapRenders[el];
            }
            else {
                return el;
            }
        })
            .map((el, i) => {
            return (react_1.default.createElement(Button_1.default, { key: el.label + i, className: clsx_1.default(classes.btn, { [classes.current]: props.value === el.value }), startIcon: el.icon, onClick: () => onChange(el.value) }, el.label));
        }))));
}
exports.default = react_1.default.memo(CropperAspectRatio);
