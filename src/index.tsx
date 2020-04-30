import React from "react";
import {Box} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";
import {WithStyles} from "@material-ui/styles";

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
    dragged: DragItem | null;
    crop: Crop;
    image: Crop;
    zoom: number;
}

class Cropper extends React.Component<CropperProps, CropperState> {
    public cropArea: HTMLDivElement | null = null;
    public cropGrid: HTMLDivElement | null = null;
    public canvas: HTMLCanvasElement | null = null;
    public ctx: CanvasRenderingContext2D | null = null;
    public image: HTMLImageElement | null = null;

    public state = {
        dragged: null,
        crop: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        image: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        zoom: 1.2,
    };

    protected onChange = (state: Partial<CropperState>) => {
        this.setState({...this.state, ...state});
    }

    public componentDidMount(): void {
        const {crop} = this.state;

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        if (this.cropGrid) {
            this.cropGrid.addEventListener('wheel', this.onMouseWheel);
        }

        if (this.cropArea) {
            const rect = this.cropArea.getBoundingClientRect();

            if (this.canvas) {
                const image = new Image();
                image.src = this.props.src;
                this.image = image;

                image.onload = () => {
                    // @ts-ignore
                    const ctx = this.canvas.getContext('2d');
                    this.ctx = ctx;

                    const zoom = crop.height / image.height;
                    const width = image.width * zoom;
                    const height = image.height * zoom;
                    const x = (rect.width / 2) - width / 2;
                    const y = (rect.height / 2) - height / 2;

                    // const y = crop.y;

                    this.onChange({
                        crop: {
                            ...this.state.crop,
                            x,
                            width,
                        },
                        image: {
                            ...this.state.crop,
                            x,
                            y,
                            width,
                            height,
                        },
                    });
                };
            }
        }
    }

    public componentDidUpdate(prevProps: Readonly<CropperProps>, prevState: Readonly<CropperState>): void {
        if (this.state.crop !== prevState.crop || this.state.image !== prevState.image) {
            this.drawImage();
        }
    }

    public componentWillUnmount(): void {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        if (this.cropGrid) {
            this.cropGrid.removeEventListener('wheel', this.onMouseWheel);
        }
    }

    protected drawImage() {
        const {image} = this.state;

        if (this.ctx && this.image && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const zoomedWidth = image.width * this.state.zoom;
            const zoomedHeight = image.height * this.state.zoom;

            this.ctx.drawImage(
                this.image,
                image.x + 24,
                image.y + 152,
                image.width * this.state.zoom,
                image.height * this.state.zoom,
            );
        }
    }

    protected onMouseDown = (drag: DragItem) => (e: any) => {
        this.setState({...this.state, dragged: drag});
    };
    protected onMouseUp = () => {
        this.onChange({...this.state, dragged: null});
    };
    protected onMouseMove = (e: any) => {
        const {dragged, crop, image} = this.state;

        if (dragged && this.cropArea && this.image) {
            const rect = this.cropArea.getBoundingClientRect();

            const rawX = e.clientX - rect.left;
            const rawY = e.clientY - rect.top;

            const nextImage = {...image};
            const nextCrop = {...crop};

            if (dragged === 1) {
                nextCrop.x = rawX < 0 ? 0 : rawX;
                nextCrop.y = rawY < 0 ? 0 : rawY;

                nextCrop.width = crop.width - (nextCrop.x - crop.x);
                nextCrop.height = crop.height - (nextCrop.y - crop.y);

                if (nextCrop.width < 50) {
                    nextCrop.x = crop.x;
                    nextCrop.width = crop.width;
                }
                if (nextCrop.height < 50) {
                    nextCrop.y = crop.y;
                    nextCrop.height = crop.height;
                }

                // растягиваем влево
                const diffX = crop.x - nextCrop.x;
                if (diffX > 0) {
                    if (nextImage.height >= rect.height) {
                        const zoom = nextCrop.width / nextImage.width;
                        const imageHeight = nextImage.height * zoom;

                        if (imageHeight >= rect.height) {
                            nextImage.width = nextImage.width * zoom;
                            nextImage.height = imageHeight;
                            nextImage.x = nextCrop.x;
                            nextImage.y = nextImage.y - (nextImage.height - image.height) / 2;
                        }
                    }
                } else {
                    if (nextImage.height >= rect.height) {
                        const zoom = nextCrop.width / nextImage.width;
                        const imageHeight = nextImage.height * zoom;

                        if (imageHeight >= rect.height) {
                            nextImage.width = nextImage.width * zoom;
                            nextImage.height = imageHeight;
                            nextImage.x = nextCrop.x;
                            nextImage.y = nextImage.y - (nextImage.height - image.height) / 2;
                        }
                    }
                }
            } else if (dragged === 2) {
                nextCrop.y = rawY < 0 ? 0 : rawY;

                nextCrop.width = rawX - crop.x;
                nextCrop.height = crop.height - (nextCrop.y - crop.y);

                if (nextCrop.width < 50) {
                    nextCrop.width = crop.width;
                }
                if (crop.x + nextCrop.width > rect.width) {
                    nextCrop.width = crop.width;
                }
                if (nextCrop.height < 50) {
                    nextCrop.y = crop.y;
                    nextCrop.height = crop.height;
                }

                // растягиваем вправо
                const diffWidth = crop.width - nextCrop.width;

                if (diffWidth > 0) {
                    if (nextImage.height >= rect.height) {
                        const zoom = nextCrop.width / nextImage.width;
                        const imageHeight = nextImage.height * zoom;

                        if (imageHeight >= rect.height) {
                            nextImage.width = nextImage.width * zoom;
                            nextImage.height = imageHeight;
                            nextImage.y = nextImage.y - (nextImage.height - image.height) / 2;
                        }
                    }
                } else {
                    if (nextImage.height >= rect.height) {
                        const zoom = nextCrop.width / nextImage.width;
                        const imageHeight = nextImage.height * zoom;

                        if (imageHeight >= rect.height) {
                            nextImage.width = nextImage.width * zoom;
                            nextImage.height = imageHeight;
                            nextImage.y = nextImage.y - (nextImage.height - image.height) / 2;
                        }
                    }
                }
            } else if (dragged === 3) {
                nextCrop.x = rawX < 0 ? 0 : rawX;

                nextCrop.width = crop.width - (nextCrop.x - crop.x);
                nextCrop.height = rawY - crop.y;

                if (nextCrop.width < 50) {
                    nextCrop.x = crop.x;
                    nextCrop.width = crop.width;
                }
                if (nextCrop.height < 50) {
                    nextCrop.height = crop.height;
                }
                if (crop.y + nextCrop.height > rect.height) {
                    nextCrop.height = crop.height;
                }
            } else if (dragged === 4) {
                nextCrop.width = rawX - crop.x;
                nextCrop.height = rawY - crop.y;

                if (nextCrop.width < 50) {
                    nextCrop.width = crop.width;
                }
                if (crop.x + nextCrop.width > rect.width) {
                    nextCrop.width = crop.width;
                }
                if (nextCrop.height < 50) {
                    nextCrop.height = crop.height;
                }
                if (crop.y + nextCrop.height > rect.height) {
                    nextCrop.height = crop.height;
                }
            }

            this.onChange({
                image: nextImage,
                crop: nextCrop,
            })
        }
    };

    protected zoomTo = (img: HTMLImageElement, imageCrop: Crop, crop: Crop, zoom: number): Crop => {
        const width = img.width * zoom;
        const height = img.height * zoom;

        const diffW = width - imageCrop.width;
        const diffH = height - imageCrop.height;

        const cropCenterX = (crop.x + crop.width / 2) - imageCrop.x;
        const xPercent = cropCenterX / imageCrop.width;
        const cropCenterY = (crop.y + crop.height / 2) - imageCrop.y;
        const yPercent = cropCenterY / imageCrop.height;

        const x = imageCrop.x - (diffW * xPercent);
        const y = imageCrop.y - (diffH * yPercent);

        return {
            x, y,
            width, height,
        };
    }

    protected onMouseWheel = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        const {image, crop} = this.state;

        if (this.image && this.cropArea) {
            const deltaY = e.deltaY;
            const lastZoom = image.height / this.image.height;
            let zoom = lastZoom - (deltaY / 5000);

            const nextImage = {...image};

            // const rect = this.cropArea.getBoundingClientRect();

            if (deltaY < 0) {
                // инкремент
                const nextImageCrop = this.zoomTo(this.image, image, crop, zoom);

                Object.assign(nextImage, nextImageCrop);
            } else {
                // декремент

                // если картинка меньше зума, ставим максимально возможный
                if (this.image.width * zoom < crop.width) {
                    zoom = crop.width / this.image.width;
                }
                if (this.image.height * zoom < crop.height) {
                    zoom = crop.height / this.image.height;
                }

                Object.assign(
                    nextImage,
                    this.zoomTo(this.image, image, crop, zoom),
                );

                const topDiff = crop.y - nextImage.y;
                const leftDiff = crop.x - nextImage.x;
                const rightDiff = (crop.x + crop.width) - (nextImage.x + this.image.width * zoom);
                const bottomDiff = (crop.y + crop.height) - (nextImage.y + this.image.height * zoom);

                const top = Math.abs(topDiff) < Math.abs(bottomDiff);
                const left = Math.abs(leftDiff) < Math.abs(rightDiff);

                const lt = left && top;
                const rt = !left && top;
                const lb = left && !top;
                const rb = !left && !top;

                if (lt) {
                    if (crop.x < nextImage.x) {
                        nextImage.x = crop.x;
                    }
                    if (crop.y < nextImage.y) {
                        nextImage.y = crop.y;
                    }
                }
                if (rt) {
                    const imageRightX = nextImage.x + nextImage.width;
                    const cropRightX = crop.x + crop.width;

                    if (cropRightX > imageRightX) {
                        nextImage.x = nextImage.x + (cropRightX - imageRightX);
                    }
                    if (crop.y < nextImage.y) {
                        nextImage.y = crop.y;
                    }
                }
                if (lb) {
                    const imageBottomY = nextImage.y + nextImage.height;
                    const croBottomY = crop.y + crop.height;

                    if (crop.x < nextImage.x) {
                        nextImage.x = crop.x;
                    }
                    if (croBottomY > imageBottomY) {
                        nextImage.y = nextImage.y + (croBottomY - imageBottomY);
                    }
                }
                if (rb) {
                    const imageRightX = nextImage.x + nextImage.width;
                    const cropRightX = crop.x + crop.width;
                    const imageBottomY = nextImage.y + nextImage.height;
                    const croBottomY = crop.y + crop.height;

                    if (cropRightX > imageRightX) {
                        nextImage.x = nextImage.x + (cropRightX - imageRightX);
                    }
                    if (croBottomY > imageBottomY) {
                        nextImage.y = nextImage.y + (croBottomY - imageBottomY);
                    }
                }

                if (nextImage.width < crop.width) {
                    return;
                }
                if (nextImage.height < crop.height) {
                    return;
                }
            }

            this.onChange({
                image: nextImage,
            });
        }
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
                <Toolbar style={{height: 76}}>
                    tools
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
