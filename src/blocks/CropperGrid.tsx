import React from 'react';
import Box from "@material-ui/core/Box";
import {Crop, CropManagerState, DragItemType} from "../CropManager";
import clsx from 'clsx';
import {Store} from "@muzikanto/observable";
import StoreConsumer from "@muzikanto/observable/StoreConsumer";
import {WithStyles} from "@material-ui/styles";
import withStyles from "@material-ui/styles/withStyles";

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
} as const);

export interface CropperGridProps extends WithStyles<typeof styles> {
    store: Store<CropManagerState>;

    onMouseDown: (type: DragItemType, start: { x: number, y: number }) => void;
    onMouseUp: () => void;

    areaRef: (ref: HTMLDivElement) => void;
    gridRef: (ref: HTMLDivElement) => void;

    rotateToAngle?: boolean;
    sizePreview?: boolean;
}

function CropperGrid(props: CropperGridProps) {
    const classes = props.classes;

    const onMouseDown = (type: DragItemType) => (e: any) => {
        props.onMouseDown(type, {x: e.clientX, y: e.clientY});
    };

    const diffHeight = props.rotateToAngle ? 56 : 0;

    const dots = React.useMemo(() => (
        <>
            <Box
                className={clsx(classes.circle, classes.circle_lt)}
                onMouseDown={onMouseDown('lt')}
            >
                <div className={classes.circleIcon}/>
            </Box>
            <Box
                className={clsx(classes.circle, classes.circle_rt)}
                onMouseDown={onMouseDown('rt')}
            >
                <div className={classes.circleIcon}/>
            </Box>
            <Box
                className={clsx(classes.circle, classes.circle_lb)}
                onMouseDown={onMouseDown('lb')}
            >
                <div className={classes.circleIcon}/>
            </Box>
            <Box
                className={clsx(classes.circle, classes.circle_rb)}
                onMouseDown={onMouseDown('rb')}
            >
                <div className={classes.circleIcon}/>
            </Box>
        </>
    ), []);

    const sizeSelector = (s: CropManagerState) => ({
        initialZoom: s.initialZoom,
        zoom: s.zoom,
        image: s.imageCrop
    });

    return (
        <div
            className={classes.root}
            onMouseUp={props.onMouseUp}
            ref={props.areaRef}
            style={{height: `calc(100% - ${diffHeight}px - 72px - 24px)`}}
        >
            <StoreConsumer store={props.store} selector={s => s.crop}>
                {
                    (crop: Crop) => {
                        return (
                            <div
                                className={classes.grid}
                                style={{
                                    left: crop.x,
                                    top: crop.y,
                                    width: crop.width,
                                    height: crop.height,
                                }}
                                ref={props.gridRef}
                            >
                                {dots}
                                {
                                    props.sizePreview &&
                                    <StoreConsumer
                                        store={props.store}
                                        selector={sizeSelector}
                                    >
                                        {
                                            ({zoom, image}: { zoom: number; image: Crop; }) => {
                                                const imgWidth = image.width * zoom;
                                                const imgHeight = image.width * zoom;

                                                const w = imgWidth - (imgWidth - crop.width);
                                                const h = imgHeight - (imgHeight - crop.height);

                                                const width = Math.round(w / zoom);
                                                const height = Math.round(h / zoom);

                                                return (
                                                    <div
                                                        className={clsx(classes.size, {[classes.size_bottom]: crop.width < 100})}
                                                    >
                                                        {width} x {height}
                                                    </div>
                                                )
                                            }
                                        }
                                    </StoreConsumer>
                                }
                            </div>
                        )
                    }
                }
            </StoreConsumer>
        </div>
    );
}

export default React.memo(withStyles(styles, {name: 'Cropper-grid'})(CropperGrid));
