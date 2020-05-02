import React from 'react';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import withStyles from '@material-ui/core/styles/withStyles';
import {WithStyles} from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import FlipIcon from '@material-ui/icons/Flip';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import RestoreIcon from '@material-ui/icons/Restore';
import CropIcon from '@material-ui/icons/Crop';
import CropManager, {Crop, CropManagerState, DragItemType} from './CropManager';
import createStore from "@muzikanto/observable/createStore";
import StoreConsumer from "@muzikanto/observable/StoreConsumer";

// https://pqina.nl/doka/?ref=filepond#features

const styles = () => ({
    root: {
        boxSizing: 'border-box',
        // overflow: 'hidden',
        position: 'relative',
        background: 'radial-gradient(#4f4c4c, #000000)',
        borderRadius: 10,
        boxShadow: '0 0.65rem 0.5rem -0.5rem rgba(0,0,0,.5), 0 0.75rem 3rem rgba(0,0,0,.5)',
    },
    toolbar: {
        height: 76, zIndex: 1, display: 'flex', justifyContent: 'space-between',
    },
    subToolbar: {
        height: 72, display: 'flex', justifyContent: 'center',
    },
    btn: {
        zIndex: 1, color: 'white', marginLeft: 7, marginRight: 7,
    },
    crop: {
        zIndex: 1,
        userSelect: 'none',
        height: 296,
        margin: '4px 24px 24px 24px',
        position: 'relative',
    },
    tab: {
        minWidth: 72,
        marginLeft: 5,
        marginRight: 5,
    },
    cropGrid: {
        boxSizing: 'border-box',
        position: 'absolute',
        border: 'solid 1px white',
        cursor: 'move',
    },
    canvas: {
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
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
} as const);

export interface CropperProps extends WithStyles<typeof styles> {
    src: string;
}

export interface CropperState {
    tab: number;
}

const store = createStore<CropManagerState>({
    imageCrop: {x: 0, y: 0, width: 0, height: 0},
    crop: {x: 0, y: 0, width: 0, height: 0},
    zoom: 1,
    initialChanged: false,
    changed: false,
    lastChanged: null,
    angle: 0,
    flipX: false,
    flipY: false,
});

class Cropper extends React.Component<CropperProps, CropperState> {
    public cropArea: HTMLDivElement | null = null;
    public cropGrid: HTMLDivElement | null = null;
    public canvas: HTMLCanvasElement | null = null;

    public state = {tab: 0};

    protected manager: CropManager | null = null;

    protected refreshConfig = () => {
        this.manager!.refreshState();
    }

    public componentDidMount(): void {
        if (this.cropArea && this.canvas && this.cropGrid) {
            this.manager = new CropManager(store, this.canvas, this.cropArea);

            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
            this.cropGrid.addEventListener('wheel', this.onMouseWheel);

            this.manager.loadImage(this.props.src);
        }
    }

    public componentWillUnmount(): void {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        if (this.cropGrid) {
            this.cropGrid.removeEventListener('wheel', this.onMouseWheel);
        }
    }

    protected onMouseDown = (drag: DragItemType) => (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        this.manager!.setDragged(drag, {x: e.clientX, y: e.clientY});
    };
    protected onMouseUp = () => {
        this.manager!.clearDragged();
    };
    protected onMouseMove = (e: any) => {
        this.manager!.move(
            {x: e.clientX, y: e.clientY},
        );
    };

    protected onMouseWheel = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        this.manager!.zoom(e.deltaY);
    }

    public render() {
        const {classes} = this.props;
        const {tab} = this.state;

        return (
            <Box
                width={928}
                height={528}
                className={classes.root}
            >
                <Toolbar className={classes.toolbar}>
                    <StoreConsumer store={store} selector={s => s.changed}>
                        {
                            (changed: boolean) => {
                                if (changed) {
                                    return (
                                        <IconButton
                                            color='inherit'
                                            style={{
                                                color: 'white', backgroundColor: '#ffffff26',
                                            }}
                                            onClick={() => {
                                                this.refreshConfig();
                                            }}
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
                    <Tabs
                        value={tab}
                        onChange={(_, v) => {
                            if (v === -1) {
                                this.manager!.save();
                            } else {
                                this.setState((prevState) => ({...prevState, tab: v}));
                            }
                        }}
                        textColor='inherit'
                        style={{color: 'white'}}
                    >
                        <Tab label='Crop' icon={<CropIcon/>} className={classes.tab}/>
                        <Tab label='Save' value={-1} className={classes.tab}/>
                    </Tabs>
                    <Button
                        style={{backgroundColor: '#ffd843'}}
                        variant='contained'
                    >Done</Button>
                </Toolbar>

                <Toolbar className={classes.subToolbar}>
                    <Button
                        className={classes.btn}
                        startIcon={<RotateLeftIcon/>}
                        variant='outlined'
                        color='inherit'
                        onClick={() => this.manager!.rotateLeft()}
                    >Rotate left</Button>
                    <StoreConsumer store={store} selector={s => s.flipX}>
                        {
                            (flipX: boolean) => (
                                <Button
                                    className={classes.btn}
                                    startIcon={<FlipIcon style={{transform: `rotate(${flipX ? 180 : 0}deg)`}}/>}
                                    variant='outlined'
                                    color='inherit'
                                    onClick={() => this.manager!.flipX()}
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
                                    onClick={() => this.manager!.flipY()}
                                >Flip vertical</Button>
                            )
                        }
                    </StoreConsumer>
                    <Button
                        className={classes.btn}
                        startIcon={<AspectRatioIcon/>}
                        variant='outlined'
                        color='inherit'
                    >Aspect ratio</Button>
                </Toolbar>

                <StoreConsumer store={store} selector={s => s.crop}>
                    {
                        (crop: Crop) => {
                            return (
                                <div
                                    className={classes.crop}
                                    onMouseUp={this.onMouseUp}
                                    ref={el => this.cropArea = el}
                                >
                                    <div
                                        className={classes.cropGrid}
                                        style={{
                                            left: crop.x,
                                            top: crop.y,
                                            width: crop.width,
                                            height: crop.height,
                                        }}
                                        ref={r => this.cropGrid = r}
                                        onMouseDown={this.onMouseDown('image')}
                                    >
                                        <Box
                                            style={{
                                                left: 0,
                                                top: 0,
                                                transform: 'translate(-50%, -50%)',
                                                cursor: 'nwse-resize'
                                            }}
                                            className={classes.circle}
                                            onMouseDown={this.onMouseDown('lt')}
                                        >
                                            <div className={classes.circleIcon}/>
                                        </Box>
                                        <Box
                                            style={{
                                                right: 0,
                                                top: 0,
                                                transform: 'translate(50%, -50%)',
                                                cursor: 'nesw-resize'
                                            }}
                                            className={classes.circle}
                                            onMouseDown={this.onMouseDown('rt')}
                                        >
                                            <div className={classes.circleIcon}/>
                                        </Box>
                                        <Box
                                            style={{
                                                left: 0,
                                                bottom: 0,
                                                transform: 'translate(-50%, 50%)',
                                                cursor: 'nesw-resize'
                                            }}
                                            className={classes.circle}
                                            onMouseDown={this.onMouseDown('lb')}
                                        >
                                            <div className={classes.circleIcon}/>
                                        </Box>
                                        <Box
                                            style={{
                                                right: 0,
                                                bottom: 0,
                                                transform: 'translate(50%, 50%)',
                                                cursor: 'nwse-resize'
                                            }}
                                            className={classes.circle}
                                            onMouseDown={this.onMouseDown('rb')}
                                        >
                                            <div className={classes.circleIcon}/>
                                        </Box>
                                    </div>
                                </div>
                            );
                        }
                    }
                </StoreConsumer>

                <Box style={{height: 56}}>
                    rotate
                </Box>

                <canvas
                    ref={el => this.canvas = el}
                    className={classes.canvas}
                    width={928}
                    height={528}
                />
            </Box>
        );
    }
}

export default withStyles(styles)(Cropper);
