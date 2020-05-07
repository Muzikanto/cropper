import React from 'react';
import Toolbar from "@material-ui/core/Toolbar";
import StoreConsumer from "@muzikanto/observable/StoreConsumer";
import IconButton from "@material-ui/core/IconButton";
import RestoreIcon from '@material-ui/icons/Restore';
import CropperToolbarTabs from "./CropperToolbarTabs";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/styles/makeStyles/makeStyles";
import {CropManagerState} from "../CropManager";
import {Store} from "@muzikanto/observable";

const useStyles = makeStyles(() => ({
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
}), {name: 'Cropper-toolbar'});

export interface CropperToolbarProps {
    store: Store<CropManagerState>;

    tab: number;
    onChangeTab?: (tab: number) => void;

    onDone: () => void;
    onRefresh?: () => void;
}

function CropperToolbar(props: CropperToolbarProps) {
    const classes = useStyles();
    const store = props.store;

    const onChangeTab = React.useCallback((v: number) => {
        if (props.onChangeTab) {
            props.onChangeTab(v);
        }
    }, [props.onChangeTab]);

    return (
        <Toolbar className={classes.root}>
            <StoreConsumer store={store} selector={s => s.changed}>
                {
                    (changed: boolean) => {
                        if (changed) {
                            return (
                                <IconButton
                                    className={classes.refresh}
                                    onClick={props.onRefresh}
                                >
                                    <RestoreIcon/>
                                </IconButton>
                            );
                        } else {
                            return (
                                <div style={{width: 48, height: 48}}/>
                            );
                        }
                    }
                }
            </StoreConsumer>
            <CropperToolbarTabs
                value={props.tab}
                onChange={onChangeTab}
            />
            <Button
                className={classes.done}
                variant='contained'
                onClick={props.onDone}
            >Done</Button>
        </Toolbar>
    )
}

export default CropperToolbar;
