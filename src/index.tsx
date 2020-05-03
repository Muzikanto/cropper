import React from 'react';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
import {WithStyles} from '@material-ui/styles';
import CropManager, {Crop, CropManagerState} from './CropManager';
import createStore from "@muzikanto/observable/createStore";
import StoreConsumer from "@muzikanto/observable/StoreConsumer";
import CropperSubBarCrop from "./blocks/CropperSubBarCrop";
import CropperToolbar from "./blocks/CropperToolbar";
import CropperGrid from "./blocks/CropperGrid";
import CropperRotate from './blocks/CropperRotate/CropperRotate.container';
import CropperTab from "./blocks/CropperTab";

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
    subBar: {
        height: 72,
    },
    canvas: {
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
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
    aspectRatio: 1.6,
});

class Cropper extends React.Component<CropperProps, CropperState> {
    public gridRef: HTMLDivElement | null = null;
    public areaRef: HTMLDivElement | null = null;
    public canvasRef: HTMLCanvasElement | null = null;

    public state = {tab: 0};

    protected manager: CropManager | null = null;

    public componentDidMount(): void {
        if (this.areaRef && this.canvasRef && this.gridRef) {
            this.manager = new CropManager(store, this.canvasRef, this.areaRef);

            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.clearDragged);
            document.addEventListener('mouseleave', this.clearDragged);
            this.gridRef.addEventListener('wheel', this.onMouseWheel);

            this.manager.loadImage(this.props.src);
        }
    }

    public componentWillUnmount(): void {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.clearDragged);
        document.removeEventListener('mouseleave', this.clearDragged);

        if (this.gridRef) {
            this.gridRef.removeEventListener('wheel', this.onMouseWheel);
        }
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
                <CropperToolbar
                    store={store}
                    tab={tab}
                    onChangeTab={(v) => this.setState((prevState) => ({...prevState, tab: v}))}
                    onRefresh={() => this.manager!.refreshState()}
                />

                <CropperTab tab={this.state.tab} value={0}>
                    <CropperSubBarCrop
                        className={classes.subBar}
                        store={store}

                        onAspectRatio={v => this.manager!.changeAspectRatio(v)}
                        onFlipX={() => this.manager!.flipX()}
                        onFlipY={() => this.manager!.flipY()}
                        onRotateLeft={() => this.manager!.rotateLeft()}
                        onRotateRight={() => this.manager!.rotateRight()}
                    />

                    <StoreConsumer store={store} selector={s => s.crop}>
                        {
                            (crop: Crop) => {
                                return (
                                    <CropperGrid
                                        crop={crop}
                                        onMouseUp={this.clearDragged}
                                        onMouseDown={(type, data) => this.manager!.setDragged(type, data)}
                                        areaRef={areaRef => this.areaRef = areaRef}
                                        gridRef={gridRef => this.gridRef = gridRef}
                                    />
                                );
                            }
                        }
                    </StoreConsumer>

                    <CropperRotate/>
                </CropperTab>

                <canvas
                    ref={canvasRef => this.canvasRef = canvasRef}
                    className={classes.canvas}
                    width={928}
                    height={528}
                />
            </Box>
        );
    }

    protected clearDragged = () => {
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

}

export default withStyles(styles)(Cropper);
