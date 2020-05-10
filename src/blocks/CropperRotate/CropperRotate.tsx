import React from 'react';
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/styles/makeStyles/makeStyles";

const useStyles = makeStyles(() => ({
    root: {
        height: 56,
        fontSize: 3,
        color: '#ffffff73',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
    },
    scroll: {
        zIndex: 2,
        width: 700,
        overflow: 'hidden',
        mask: 'linear-gradient(90deg,transparent 15%,#000 40%,#000 60%,transparent 85%)',
        userSelect: 'none',
        '&:hover': {
            cursor: 'ew-resize',
        },
        position: 'relative',
    },
    current: {
        top: 0,
        position: 'absolute',
        width: 2,
        height: 10,
        backgroundColor: 'white',
        transform: 'translate(25%, 0)',
        zIndex: 2,
    },
    svg: {
        width: 700,
        position: 'absolute',
        left: 0,
        top: 15,
        transform: 'scale(11)',
        color: '#c7c7c7',
    },
}), {name: 'Cropper-rotate'});

export interface CropperRotateProps {
    angle: number;

    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
}

function CropperRotate(props: CropperRotateProps) {
    const classes = useStyles();

    const left = props.angle * -5.335;

    return (
        <Box className={classes.root}>
            <span className={classes.current}/>
            <div
                className={classes.scroll}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
            >
                <svg
                    viewBox="-720 -5 1440 10" className={classes.svg}
                    style={{left}}
                >
                    {
                        new Array(80)
                            .fill(0)
                            .map((_, i) => {
                                let v = i * 10 - 400;

                                return (
                                    <React.Fragment key={'rotate-dot' + i}>
                                        <circle fill="currentColor" cx={v} cy="0" r="0.5"/>
                                        <text fill="currentColor" x={v - 1.5} y="3.5">{v}°</text>

                                        <circle fill="currentColor" cx={v + 2} cy="0" r="0.2"/>
                                        <circle fill="currentColor" cx={v + 4} cy="0" r="0.2"/>
                                        <circle fill="currentColor" cx={v + 6} cy="0" r="0.2"/>
                                        <circle fill="currentColor" cx={v + 8} cy="0" r="0.2"/>
                                    </React.Fragment>
                                )
                            })
                    }
                </svg>
            </div>
        </Box>
    );
}

export default React.memo(CropperRotate);
