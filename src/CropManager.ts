import {Store} from "@muzikanto/observable";

export interface Pos2d {
    x: number;
    y: number;
}

export interface Crop extends Pos2d {
    width: number;
    height: number;
}

export interface CropManagerState {
    crop: Crop;
    imageCrop: Crop;
    zoom: number;
    changed: boolean;
    angle: number;
    flipX: boolean;
    flipY: boolean;
}

export type DragItemType = 'lt' | 'rt' | 'lb' | 'rb' | 'image';

export type DraggedData = {
    type: DragItemType;
    data: { x: number, y: number; };
}

type Watcher = (params: Pick<CropManagerState, 'changed' | 'flipX' | 'flipY' | 'crop'>) => void

class CropManager {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public defaultImage: HTMLImageElement | null = null;
    public newImage: HTMLImageElement | null = null;
    public area: HTMLDivElement;

    public defaulState: CropManagerState = {
        crop: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        imageCrop: {
            x: 0, y: 0,
            width: 0, height: 0,
        },
        zoom: 1,
        changed: false,
        angle: 0,
        flipX: false,
        flipY: false,
    };
    public dragged: DraggedData | null = null;
    public state: CropManagerState = {
        crop: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        imageCrop: {
            x: 0, y: 0,
            width: 0, height: 0,
        },
        zoom: 1,
        changed: false,
        angle: 0,
        flipX: false,
        flipY: false,
    };
    public store: Store<CropManagerState>;

    constructor(canvas: HTMLCanvasElement, area: HTMLDivElement, store: Store<CropManagerState>) {
        this.canvas = canvas;
        this.area = area;
        this.store = store;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx = ctx;
    }

    protected changeState = (nextState: Partial<CropManagerState>) => {
        this.state = {...this.state, ...nextState};

        this.watch({
            flipY: this.state.flipY,
            flipX: this.state.flipX,
            crop: this.state.crop,
            changed: this.state.changed,
        });
        this.drawImage();
        this.state.changed = true;
    }

    public loadImage = (src: string) => {
        const image = new Image();
        image.src = src;
        this.defaultImage = image;

        image.onload = () => {
            const savedConfig = localStorage.getItem('test');

            const defaultConfig = this.getDefaultConfig();

            if (savedConfig) {
                const nextState = JSON.parse(savedConfig);
                this.changeState(nextState);
            } else {
                this.changeState(defaultConfig);
            }

            this.defaulState = defaultConfig;
        };
    }

    public drawImage() {
        const image = this.defaultImage!;
        const crop = this.state.crop;
        const ctx = this.ctx;

        const horizontalMargin = 24;
        const topMargin = 152;

        const zoom = this.state.zoom;
        const flipX = this.state.flipX ? -1 : 1;
        const flipY = this.state.flipY ? -1 : 1;

        const x = this.state.imageCrop.x + 24;
        const y = this.state.imageCrop.y + 152;
        const w = image.width * zoom;
        const h = image.height * zoom;

        const cropLeft = crop.x + horizontalMargin;
        const cropRight = cropLeft + crop.width;
        const cropTop = crop.y + topMargin;
        const cropBottom = cropTop + crop.height;

        const translateX = (cropLeft + crop.width);
        const translateY = (cropTop + crop.height);

        // clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();

        // set center of canvas
        ctx.translate(translateX, translateY);

        ctx.scale(flipX, flipY);

        // draw image
        ctx.drawImage(image,
            (x - translateX) * flipX,
            (y - translateY) * flipY,
            w * flipX,
            h * flipY,
        );

        // darken background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';

        ctx.fillRect(
            (0 - translateX) * flipX,
            (0 - translateY) * flipY,
            cropLeft * flipX,
            this.canvas.height * flipY,
        );
        ctx.fillRect(
            (cropRight - translateX) * flipX,
            (0 - translateY) * flipY,
            this.canvas.width * flipX,
            this.canvas.height * flipY,
        );
        ctx.fillRect(
            (cropLeft - translateX) * flipX,
            (0 - translateY) * flipY,
            crop.width * flipX,
            cropTop * flipY,
        );
        ctx.fillRect(
            (cropLeft - translateX) * flipX,
            (cropBottom - translateY) * flipY,
            crop.width * flipX,
            this.canvas.height * flipY,
        );

        ctx.restore();
    }

    public getDefaultConfig = () => {
        const image = this.defaultImage!;
        const rect = this.area.getBoundingClientRect();

        const zoom = rect.height / image.height;
        const width = image.width * zoom;
        const height = image.height * zoom;
        const x = (rect.width / 2) - width / 2;
        const y = (rect.height / 2) - height / 2;

        return {
            crop: {
                x,
                y: this.defaulState.crop.y,
                width,
                height: this.defaulState.crop.height,
            },
            imageCrop: {
                x,
                y,
                width: image.width,
                height: image.height,
            },
            zoom,
            changed: false,
            angle: 0,
            flipX: false,
            flipY: false,
        };
    }

    public zoomTo = (img: HTMLImageElement, imageCrop: Pos2d, crop: Crop, zoom: number) => {
        const prevWidth = this.defaultImage!.width * this.state.zoom;
        const prevHeight = this.defaultImage!.height * this.state.zoom;
        const width = this.defaultImage!.width * zoom;
        const height = this.defaultImage!.height * zoom;

        const diffW = width - prevWidth;
        const diffH = height - prevHeight;

        const cropCenterX = (crop.x + crop.width / 2) - imageCrop.x;
        const xPercent = cropCenterX / prevWidth;
        const cropCenterY = (crop.y + crop.height / 2) - imageCrop.y;
        const yPercent = cropCenterY / prevHeight;

        const x = imageCrop.x - (diffW * xPercent);
        const y = imageCrop.y - (diffH * yPercent);

        return {
            x, y,
        };
    }

    public move = (cursor: { x: number, y: number }) => {
        const dragged = this.dragged;
        const imageCrop = this.state.imageCrop;
        const crop = this.state.crop;

        if (dragged) {
            if (['lt', 'rt', 'lb', 'rb'].indexOf(dragged.type) > -1) {
                const rect = this.area.getBoundingClientRect();

                const rawX = cursor.x - rect.left;
                const rawY = cursor.y - rect.top;

                const nextImage = {...imageCrop};
                const nextCrop = {...crop};
                let zoom = this.state.zoom;

                // crop params
                if (dragged.type === 'lt') {
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
                } else if (dragged.type === 'rt') {
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
                } else if (dragged.type === 'lb') {
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
                } else if (dragged.type === 'rb') {
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
                // -----------

                // scale
                const defaultZoom = rect.height / imageCrop.height;

                const rectWidth = this.round(imageCrop.width * this.defaulState.zoom * (this.state.zoom / defaultZoom));
                const rectHeight = this.round(imageCrop.height * this.defaulState.zoom * (this.state.zoom / defaultZoom));

                const imageWidth = this.round(imageCrop.width * this.state.zoom);
                const imageHeight = this.round(imageCrop.height * this.state.zoom);

                const diffX = crop.x - nextCrop.x || crop.width - nextCrop.width;
                const diffY = crop.y - nextCrop.y || crop.height - nextCrop.height;

                if (diffX > 0) {
                    if (imageHeight >= rectHeight) {
                        const lWZoom = nextCrop.width / imageCrop.width;
                        const lHZoom = nextCrop.height / imageCrop.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageHeight = imageCrop.height * nextZoom;

                        if (nextCrop.width < imageWidth) {
                            if (nextCrop.x < nextImage.x) {
                                nextImage.x = nextImage.x + (nextCrop.x - crop.x);
                            }
                        } else {
                            if (nextImageHeight > rectHeight) {
                                zoom = nextZoom;
                                nextImage.x = nextCrop.x;
                                nextImage.y = nextImage.y - (nextImageHeight - imageHeight) / 2;
                            }
                        }
                    }
                } else if (diffX < 0) {
                    if (imageHeight >= rectHeight) {
                        const lWZoom = nextCrop.width / imageCrop.width;
                        const lHZoom = nextCrop.height / imageCrop.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageHeight = imageCrop.height * nextZoom;

                        if (nextCrop.width < imageWidth) {
                            if (nextCrop.x + nextCrop.width > nextImage.x + imageWidth) {
                                nextImage.x = nextImage.x + (nextCrop.width - crop.width);
                            }
                        } else {
                            if (nextImageHeight > rectHeight) {
                                zoom = nextZoom;
                                nextImage.x = nextCrop.x;
                                nextImage.y = nextImage.y - (nextImageHeight - imageHeight) / 2;
                            }
                        }
                    }
                }

                if (diffY > 0) {
                    if (imageWidth >= rectWidth) {
                        const lWZoom = nextCrop.width / imageCrop.width;
                        const lHZoom = nextCrop.height / imageCrop.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageWidth = imageCrop.width * nextZoom;
                        const nextImageHeight = imageCrop.height * nextZoom;

                        if (nextCrop.height < imageHeight) {
                            if (nextCrop.y < nextImage.y) {
                                nextImage.y = nextCrop.y;
                            }
                        } else {
                            if (nextImageWidth > rectWidth) {
                                zoom = nextZoom;
                                nextImage.x = nextImage.x - (nextImageWidth - imageWidth) / 2;
                                nextImage.y = nextImage.y - (nextImageHeight - imageHeight);
                            }
                        }
                    }
                } else if (diffY < 0) {
                    if (imageWidth >= rectWidth) {
                        const lWZoom = nextCrop.width / imageCrop.width;
                        const lHZoom = nextCrop.height / imageCrop.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageWidth = imageCrop.width * nextZoom;

                        if (nextCrop.height < imageHeight) {
                            if (nextCrop.y + nextCrop.height > nextImage.y + imageHeight) {
                                nextImage.y = nextImage.y - (nextCrop.height - crop.height);
                            }
                        } else {
                            if (nextImageWidth > rectWidth) {
                                zoom = nextZoom;
                                nextImage.x = nextImage.x - (nextImageWidth - imageWidth) / 2;
                                nextImage.y = nextCrop.y;
                            }
                        }
                    }
                }
                // -----------

                this.changeState({
                    imageCrop: nextImage,
                    crop: nextCrop,
                    zoom,
                });
            } else {
                if (dragged.type === 'image') {
                    const nextImage = {...this.state.imageCrop};

                    const diffX = cursor.x - dragged.data.x;
                    const diffY = cursor.y - dragged.data.y;

                    const nextX = nextImage.x + diffX;
                    const nextY = nextImage.y + diffY;

                    if (nextX <= crop.x && nextX + imageCrop.width * this.state.zoom > (crop.x + crop.width)) {
                        nextImage.x = nextX;
                    }
                    if (nextY <= crop.y && nextY + imageCrop.height * this.state.zoom > (crop.y + crop.height)) {
                        nextImage.y = nextY;
                    }

                    this.dragged!.data = cursor;
                    this.changeState({
                        imageCrop: nextImage,
                    });
                }
            }
        }

        return null;
    }

    public zoom = (deltaY: number) => {
        const imageCrop = this.state.imageCrop;
        const crop = this.state.crop;
        const image = this.defaultImage!;


        const prevZoom = this.state.zoom;
        let zoom = prevZoom - (deltaY / 5000);

        const nextImage = {...this.state.imageCrop};

        if (deltaY < 0) {
            // инкремент
            const nextImageCrop = this.zoomTo(image, imageCrop, crop, zoom);

            Object.assign(nextImage, nextImageCrop);
        } else {
            // декремент

            const imageWidth = imageCrop.width * this.state.zoom;
            const imageHeight = imageCrop.height * this.state.zoom;
            let nextImageWidth = imageCrop.width * zoom;
            let nextImageHeight = imageCrop.height * zoom;

            // если картинка меньше зума, ставим максимально возможный
            if (nextImageWidth < crop.width) {
                zoom = crop.width / imageCrop.width;
                nextImageWidth = imageCrop.width * zoom;
                nextImageHeight = imageCrop.height * zoom;
            }
            if (nextImageHeight < crop.height) {
                zoom = crop.height / imageCrop.height;
                nextImageWidth = imageCrop.width * zoom;
                nextImageHeight = imageCrop.height * zoom;
            }

            const nextImageCrop = this.zoomTo(image, imageCrop, crop, zoom);

            Object.assign(
                nextImage,
                nextImageCrop,
            );

            const topDiff = crop.y - imageCrop.y;
            const leftDiff = crop.x - imageCrop.x;

            const rightDiff = (crop.x + crop.width) - (nextImage.x + imageWidth);
            const bottomDiff = (crop.y + crop.height) - (nextImage.y + imageHeight);

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
                const imageRightX = nextImage.x + nextImageWidth;
                const cropRightX = crop.x + crop.width;

                if (cropRightX > imageRightX) {
                    nextImage.x = nextImage.x + (cropRightX - imageRightX);
                }
                if (crop.y < nextImage.y) {
                    nextImage.y = crop.y;
                }
            }
            if (lb) {
                const imageBottomY = nextImage.y + nextImageHeight;
                const croBottomY = crop.y + crop.height;

                if (crop.x < nextImage.x) {
                    nextImage.x = crop.x;
                }
                if (croBottomY > imageBottomY) {
                    nextImage.y = nextImage.y + (croBottomY - imageBottomY);
                }
            }
            if (rb) {
                const imageRightX = nextImage.x + nextImageWidth;
                const cropRightX = crop.x + crop.width;
                const imageBottomY = nextImage.y + nextImageHeight;
                const croBottomY = crop.y + crop.height;

                if (cropRightX > imageRightX) {
                    nextImage.x = nextImage.x + (cropRightX - imageRightX);
                }
                if (croBottomY > imageBottomY) {
                    nextImage.y = nextImage.y + (croBottomY - imageBottomY);
                }
            }

            if (nextImageWidth < crop.width) {
                return;
            }
            if (nextImageHeight < crop.height) {
                return;
            }
        }

        this.changeState({
            imageCrop: nextImage,
            zoom,
        });
    }

    public setDragged = (type: DragItemType, data: { x: number, y: number; }) => {
        this.dragged = {type, data};
    }

    public clearDragged = () => {
        this.dragged = null;
    }

    public refreshState = () => {
        this.changeState({...this.defaulState});
    }

    public save = () => {
        localStorage.setItem('test', JSON.stringify(this.state));
    }

    public round = (v: number) => {
        return Math.round(v * 1000) / 1000;
    }

    public rotate = (angle: number) => {
        this.changeState({angle});
    }
    public rotateLeft = () => {
        const nextAngle = (this.state.angle + 90) % 360;

        this.rotate(nextAngle);
    }

    public flipX = (flipX: boolean) => {
        this.changeState({flipX});
    }
    public flipY = (flipY: boolean) => {
        this.changeState({flipY});
    }
}

export default CropManager;
