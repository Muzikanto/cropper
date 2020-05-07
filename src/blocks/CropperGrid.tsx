import React from 'react';
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/styles/makeStyles/makeStyles";
import {Crop, DragItemType} from "../CropManager";
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    root: {
        zIndex: 1,
        userSelect: 'none',
        height: 296,
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
    lt: {
        left: 0,
        top: 0,
        transform: 'translate(-50%, -50%)',
        cursor: 'nwse-resize'
    },
    rt: {
        right: 0,
        top: 0,
        transform: 'translate(50%, -50%)',
        cursor: 'nesw-resize'
    },
    lb: {
        left: 0,
        bottom: 0,
        transform: 'translate(-50%, 50%)',
        cursor: 'nesw-resize'
    },
    rb: {
        right: 0,
        bottom: 0,
        transform: 'translate(50%, 50%)',
        cursor: 'nwse-resize'
    },
}), {name: 'Cropper-grid'});

export interface CropperGridProps {
    crop: Crop;

    onMouseDown: (type: DragItemType, data: {x: number, y: number}) => void;
    onMouseUp: () => void;

    areaRef: (ref: HTMLDivElement) => void;
    gridRef: (ref: HTMLDivElement) => void;
}

function CropperGrid(props: CropperGridProps) {
    const classes = useStyles();

    const crop = props.crop;

    const onMouseDown = (type: DragItemType) => (e: any) => {
        props.onMouseDown(type, {x: e.clientX, y: e.clientY});
    };

    return (
        <div
            className={classes.root}
            onMouseUp={props.onMouseUp}
            ref={props.areaRef}
        >
            <div
                className={classes.grid}
                style={{
                    left: crop.x,
                    top: crop.y,
                    width: crop.width,
                    height: crop.height,
                }}
                ref={props.gridRef}
                // onMouseDown={onMouseDown('image')}
            >
                <Box
                    className={clsx(classes.circle, classes.lt)}
                    onMouseDown={onMouseDown('lt')}
                >
                    <div className={classes.circleIcon}/>
                </Box>
                <Box
                    className={clsx(classes.circle, classes.rt)}
                    onMouseDown={onMouseDown('rt')}
                >
                    <div className={classes.circleIcon}/>
                </Box>
                <Box
                    className={clsx(classes.circle, classes.lb)}
                    onMouseDown={onMouseDown('lb')}
                >
                    <div className={classes.circleIcon}/>
                </Box>
                <Box
                    className={clsx(classes.circle, classes.rb)}
                    onMouseDown={onMouseDown('rb')}
                >
                    <div className={classes.circleIcon}/>
                </Box>
            </div>
        </div>
    );
}

export default React.memo(CropperGrid)
