import React from "react";
import {Box} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";
import {WithStyles} from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import CropManager from "./CropManager";

// https://pqina.nl/doka/?ref=filepond#features

const styles = () => ({
    root: {
        boxSizing: 'border-box',
        // overflow: 'hidden',
        position: 'relative',
        background: 'radial-gradient(#282828, #000000)',
        borderRadius: 10,
        boxShadow: '0 0.65rem 0.5rem -0.5rem rgba(0,0,0,.5), 0 0.75rem 3rem rgba(0,0,0,.5)',
    },
    crop: {
        zIndex: 1,
        userSelect: 'none',
        height: 296,
        margin: '4px 24px 24px 24px',
        position: 'relative',
    },
    cropGrid: {
        boxSizing: 'border-box',
        position: 'absolute',
        border: 'solid 1px white',
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

export interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
}

type DragItem = 1 | 2 | 3 | 4;

export interface CropperProps extends WithStyles<typeof styles> {
    src: string;
}

export interface CropperState {
    crop: Crop;
}

class Cropper extends React.Component<CropperProps, CropperState> {
    public cropArea: HTMLDivElement | null = null;
    public cropGrid: HTMLDivElement | null = null;
    public canvas: HTMLCanvasElement | null = null;

    protected manager: CropManager | null = null;

    public state: CropperState = {
        crop: {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        },
    }

    protected onChange = (state: Partial<CropperState>) => {
        this.setState({...this.state, ...state});
    }

    protected refreshConfig = () => {
        this.manager!.refreshState();
    }

    public componentDidMount(): void {
        if (this.cropArea && this.canvas && this.cropGrid) {
            this.manager = new CropManager(this.canvas, this.cropArea, (crop) => this.onChange({crop}));

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

    protected onMouseDown = (drag: DragItem) => () => {
        this.manager!.setDragged(drag);
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
        const {crop} = this.state;

        return (
            <Box
                width={928}
                height={528}
                className={classes.root}
            >
                <Toolbar style={{height: 76, zIndex: 1}}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            this.refreshConfig();
                        }}
                    >Refresh</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            this.manager!.save();
                        }}
                    >save</Button>
                </Toolbar>

                <Toolbar style={{height: 72}}>
                    sub tools
                </Toolbar>

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
                    >
                        <Box
                            style={{left: 0, top: 0, transform: 'translate(-50%, -50%)'}}
                            className={classes.circle}
                            onMouseDown={this.onMouseDown(1)}
                        >
                            <div className={classes.circleIcon}/>
                        </Box>
                        <Box
                            style={{right: 0, top: 0, transform: 'translate(50%, -50%)'}}
                            className={classes.circle}
                            onMouseDown={this.onMouseDown(2)}
                        >
                            <div className={classes.circleIcon}/>
                        </Box>
                        <Box
                            style={{left: 0, bottom: 0, transform: 'translate(-50%, 50%)'}}
                            className={classes.circle}
                            onMouseDown={this.onMouseDown(3)}
                        >
                            <div className={classes.circleIcon}/>
                        </Box>
                        <Box
                            style={{right: 0, bottom: 0, transform: 'translate(50%, 50%)'}}
                            className={classes.circle}
                            onMouseDown={this.onMouseDown(4)}
                        >
                            <div className={classes.circleIcon}/>
                        </Box>
                    </div>
                </div>

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
