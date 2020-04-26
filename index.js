"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SvgIcon_1 = __importDefault(require("@material-ui/core/SvgIcon"));
const CardMedia_1 = __importDefault(require("@material-ui/core/CardMedia"));
const CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
const withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const styles = () => ({
    root: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: ({ aspectRatio }) => typeof aspectRatio === 'undefined' ?
            undefined :
            `calc(1 / ${aspectRatio} * 100%)`
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transition: ({ disableTransition }) => disableTransition ? undefined : `
                filterBrightness ${600 * 0.75}ms cubic-bezier(0.4, 0.0, 0.2, 1),
                filterSaturate ${600}ms cubic-bezier(0.4, 0.0, 0.2, 1),
                opacity ${600 / 2}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
    },
    empty: {
        opacity: 0,
    },
    status: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    progress: {},
    error: {
        color: '#000000e0',
        fontSize: 40,
    },
});
function Component(props) {
    const { disableError, disableSpinner, onClick } = props;
    const src = props.src || '#';
    const classes = props.classes;
    const [state, setState] = react_1.default.useState({ src: '', error: false, loaded: false });
    react_1.default.useEffect(() => {
        setState({ src, error: false, loaded: false });
    }, [src]);
    const handleLoadImage = () => {
        setState(Object.assign(Object.assign({}, state), { loaded: true }));
        if (props.onLoad) {
            props.onLoad();
        }
    };
    const handleImageError = () => {
        setState(Object.assign(Object.assign({}, state), { loaded: false, error: true }));
        if (props.onError) {
            props.onError();
        }
    };
    const showLoading = (!disableSpinner && !state.loaded && !state.error) || (props.loading && !disableSpinner);
    const showError = !disableError && state.error;
    return (react_1.default.createElement("div", Object.assign({}, props.ContainerProps, { className: clsx_1.default(classes.root, props.className), onClick: onClick, style: props.style, "aria-details": src }),
        (state.src && !props.loading && !state.error) && (react_1.default.createElement(CardMedia_1.default, Object.assign({ component: 'img' }, props.MediaProps, { className: clsx_1.default(classes.image, {
                [classes.empty]: !state.loaded,
            }, props.MediaProps && props.MediaProps.className), src: state.src, onLoad: handleLoadImage, onError: handleImageError }))),
        (showLoading || showError) && (react_1.default.createElement("div", { className: classes.status },
            showLoading && (react_1.default.createElement("div", { className: classes.status }, props.renderLoading ?
                props.renderLoading() :
                react_1.default.createElement(CircularProgress_1.default, Object.assign({}, props.ProgressProps, { className: clsx_1.default(classes.progress, props.ProgressProps && props.ProgressProps.className) })))),
            showError && (react_1.default.createElement(react_1.default.Fragment, null, props.renderError ?
                props.renderError() :
                react_1.default.createElement(SvgIcon_1.default, Object.assign({ viewBox: "0 0 384 384", width: "40", height: "40" }, props.ErrorProps, { className: clsx_1.default(classes.status, classes.error, props.ErrorProps && props.ErrorProps.className) }),
                    react_1.default.createElement("path", { d: "M234.667,264.533L149.333,179.2L64,264.533l-64-64v140.8C0,364.8,19.2,384,42.667,384h298.667     C364.8,384,384,364.8,384,341.333V243.2l-64-64L234.667,264.533z" }),
                    react_1.default.createElement("path", { d: "M341.333,0H42.667C19.2,0,0,19.2,0,42.667V140.8l64,64l85.333-85.333l85.333,85.333L320,119.467l64,64v-140.8     C384,19.2,364.8,0,341.333,0z" }))))))));
}
const Picture = react_1.default.memo(withStyles_1.default(styles, { name: 'Picture' })(Component));
exports.default = Picture;
