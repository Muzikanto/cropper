import React from 'react';
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import FlipIcon from '@material-ui/icons/Flip';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import StoreConsumer from "@muzikanto/observable/StoreConsumer";
import CropperAspectRatio from "./CropperAspectRatio";
import makeStyles from "@material-ui/styles/makeStyles/makeStyles";
import {CropManagerState} from "../CropManager";
import {Store} from "@muzikanto/observable";
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    root: {
        height: 72, display: 'flex', justifyContent: 'center', color: 'white',
    },
    btn: {
        '&.MuiButton-root': {
            zIndex: 1, color: 'white', marginLeft: 7, marginRight: 7,
            textTransform: 'initial',
        },
    },
}), {name: 'Cropper-subBarCrop'});

export interface CropperSubBarCropProps {
    className: string;

    store: Store<CropManagerState>;

    onRotateLeft: () => void;
    onRotateRight: () => void;
    onFlipX: () => void;
    onFlipY: () => void;
    onAspectRatio: (value: number | null) => void;
}

function CropperSubBarCrop(props: CropperSubBarCropProps) {
    const classes = useStyles();
    const store = props.store;

    return (
        <Toolbar className={clsx(classes.root, props.className)}>
            <Button
                className={classes.btn}
                startIcon={<RotateLeftIcon/>}
                variant='outlined'
                color='inherit'
                onClick={props.onRotateLeft}
            >Rotate left</Button>
            <Button
                className={classes.btn}
                startIcon={<RotateLeftIcon style={{transform: 'scale(-1, 1)'}}/>}
                variant='outlined'
                color='inherit'
                onClick={props.onRotateRight}
            >Rotate right</Button>
            <StoreConsumer store={store} selector={s => s.flipX}>
                {
                    (flipX: boolean) => (
                        <Button
                            className={classes.btn}
                            startIcon={<FlipIcon style={{transform: `rotate(${flipX ? 180 : 0}deg)`}}/>}
                            variant='outlined'
                            color='inherit'
                            onClick={props.onFlipX}
                        >Flip horizontal</Button>
                    )
                }
            </StoreConsumer>
            <StoreConsumer store={store} selector={s => s.flipY}>
                {
                    (flipY: boolean) => (
                        <Button
                            className={classes.btn}
                            startIcon={<FlipIcon style={{transform: `rotate(${flipY ? 270 : 90}deg)`}}/>}
                            variant='outlined'
                            color='inherit'
                            onClick={props.onFlipY}
                        >Flip vertical</Button>
                    )
                }
            </StoreConsumer>
            <StoreConsumer store={store} selector={s => s.aspectRatio}>
                {
                    (aspectRatio: number | null) => (
                        <CropperAspectRatio
                            value={aspectRatio}
                            onChange={props.onAspectRatio}
                            className={classes.btn}
                        />
                    )
                }
            </StoreConsumer>
        </Toolbar>
    );
}

export default React.memo(CropperSubBarCrop);
