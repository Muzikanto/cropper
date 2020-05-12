"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const StoreConsumer_1 = __importDefault(require("@muzikanto/observable/StoreConsumer"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Restore_1 = __importDefault(require("@material-ui/icons/Restore"));
const CropperToolbarTabs_1 = __importDefault(require("./blocks/CropperToolbarTabs"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const makeStyles_1 = __importDefault(require("@material-ui/styles/makeStyles/makeStyles"));
const useStyles = makeStyles_1.default(() => ({
    root: {
        height: 76, zIndex: 1, display: 'flex', justifyContent: 'space-between',
    },
    refresh: {
        '&.MuiIconButton-root': {
            color: 'white',
            backgroundColor: '#ffffff26',
            '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.24)',
            },
        },
    },
    done: {
        '&.MuiButton-root': {
            backgroundColor: '#ffd843',
            '&:hover': {
                backgroundColor: '#ffaf34',
            }
        },
    },
}), { name: 'Cropper-toolbar' });
function CropperToolbar(props) {
    const classes = useStyles();
    const store = props.store;
    const onChangeTab = react_1.default.useCallback((v) => {
        if (props.onChangeTab) {
            props.onChangeTab(v);
        }
    }, [props.onChangeTab]);
    return (react_1.default.createElement(Toolbar_1.default, { className: classes.root },
        react_1.default.createElement(StoreConsumer_1.default, { store: store, selector: s => s.changed }, (changed) => {
            if (changed) {
                return (react_1.default.createElement(IconButton_1.default, { className: classes.refresh, onClick: props.onRefresh },
                    react_1.default.createElement(Restore_1.default, null)));
            }
            else {
                return (react_1.default.createElement("div", { style: { width: 48, height: 48 } }));
            }
        }),
        react_1.default.createElement(CropperToolbarTabs_1.default, { value: props.tab, onChange: onChangeTab }),
        react_1.default.createElement(Button_1.default, { className: classes.done, variant: 'contained', onClick: props.onDone }, "Done")));
}
exports.default = CropperToolbar;
