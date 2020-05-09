import React from 'react';
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import FlipIcon from '@material-ui/icons/Flip';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import StoreConsumer from "@muzikanto/observable/StoreConsumer";
import CropperAspectRatio, {CropperAspectRationKeys, CropperCustomAspectRation} from "./CropperAspectRatio";
import {CropManagerState} from "../CropManager";
import {Store} from "@muzikanto/observable";
import clsx from 'clsx';
import withStyles from "@material-ui/core/styles/withStyles";
import {WithStyles} from "@material-ui/styles";

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

export interface CropperSubBarCropProps extends WithStyles<typeof styles> {
    className: string;

    store: Store<CropManagerState>;

    onRotateLeft: () => void;
    onRotateRight: () => void;
    onFlipX: () => void;
    onFlipY: () => void;
    onAspectRatio: (value: number | false) => void;

    aspectRatio?: number | Array<CropperAspectRationKeys | CropperCustomAspectRation>;
    flippedX?: boolean;
    flippedY?: boolean;
    flipped?: boolean;
    rotatedLeft?: boolean;
    rotatedRight?: boolean;
    rotate?: boolean;
}

function CropperSubBarCrop(props: CropperSubBarCropProps) {
    const classes = props.classes;
    const store = props.store;

    const rotatedLeft = props.rotatedLeft || props.rotate;
    const rotatedRight = props.rotatedRight || props.rotate;
    const flipX = props.flippedX || props.flipped;
    const flipY = props.flippedY || props.flipped;
    const aspectRatio = Array.isArray(props.aspectRatio) && props.aspectRatio.length > 1;

    return (
        <Toolbar className={clsx(classes.root, props.className)}>
            {
                rotatedLeft &&
                <Button
                    className={classes.btn}
                    startIcon={<RotateLeftIcon/>}
                    variant='outlined'
                    color='inherit'
                    onClick={props.onRotateLeft}
                >Rotate left</Button>
            }
            {
                rotatedRight &&
                <Button
                    className={classes.btn}
                    startIcon={<RotateLeftIcon style={{transform: 'scale(-1, 1)'}}/>}
                    variant='outlined'
                    color='inherit'
                    onClick={props.onRotateRight}
                >Rotate right</Button>
            }
            {
                flipX &&
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
            }
            {
                flipY &&
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
            }
            {
                aspectRatio &&
                <StoreConsumer store={store} selector={s => s.aspectRatio}>
                    {
                        (aspectRatio: number | false) => (
                            <CropperAspectRatio
                                value={aspectRatio}
                                onChange={props.onAspectRatio}
                                className={classes.btn}
                                aspectRatio={props.aspectRatio}
                            />
                        )
                    }
                </StoreConsumer>
            }
        </Toolbar>
    );
}

export default React.memo(withStyles(styles, {name: 'Cropper-subBar'})(CropperSubBarCrop));
