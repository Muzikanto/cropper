import {Store} from "@muzikanto/observable";
import cropMove from "./manager/crop-move";
import cropperZoomTo from "./manager/image-zoom";
import imageMove from "./manager/image-move";
import cropperImageScale from "./manager/image-scale";
import imageMoveToAngle from "./manager/image-move-angle";
import cropImage from "./manager/crop-image";

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
    initialChanged: boolean;
    changed: boolean;
    lastChanged: Date | null;
    angle: number;
    flipX: boolean;
    flipY: boolean;
    aspectRatio: number | null;
    minSize: { width: number; height: number; };
}

export type DragItemType = 'lt' | 'rt' | 'lb' | 'rb' | 'image';

export type DraggedData = {
    type: DragItemType;
    start: { x: number, y: number; };
}

class CropManager {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement | null = null;
    public area: HTMLDivElement;

    public dragged: DraggedData | null = null;
    public store: Store<CropManagerState>;
    public defaultState: CropManagerState;

    constructor(store: Store<CropManagerState>, canvas: HTMLCanvasElement, area: HTMLDivElement) {
        this.canvas = canvas;
        this.area = area;
        this.store = store;
        this.defaultState = store.get();

        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    protected changeState = (nextState: Partial<CropManagerState>) => {
        const state = this.store.get();

        if (!state.initialChanged) {
            this.store.set({...state, ...nextState, initialChanged: true, lastChanged: new Date()});
        } else {
            this.store.set({...state, ...nextState, changed: true, lastChanged: new Date()});
        }

        this.drawImage();
    };
    public refreshState = () => {
        this.store.set(this.defaultState);
        this.drawImage();
    };

    public loadImage = (src: string) => {
        const img = new Image();

        img.setAttribute('crossOrigin', 'Anonymous');

        img.src = src;
        img.onload = () => {
            const defaultConfig = {
                ...this.store.get(),
                ...this.getDefaultConfig(this.store.get().aspectRatio),
            };

            this.changeState(defaultConfig);

            this.defaultState = defaultConfig;
        };

        this.image = img;
    };

    protected getDefaultConfig = (aspectRatio: number | null) => {
        const rect = this.area.getBoundingClientRect();
        const img = this.image!;

        let zoom = aspectRatio ?
            aspectRatio > 1 ?
                (rect.height * aspectRatio) / img.width
                : rect.height / img.height
            : rect.height / img.height;
        let cropWidth = aspectRatio ? rect.height * aspectRatio : img.width * zoom;
        let cropHeight = aspectRatio ? rect.height : img.height * zoom;

        const cropX = (rect.width / 2) - cropWidth / 2;
        const cropY = 0;

        const imageWidth = img.width;
        const imageHeight = img.height;
        const imageX = cropX - (imageWidth * zoom - cropWidth) / 2;
        const imageY = cropY - (imageHeight * zoom - cropHeight) / 2;

        return {
            crop: {
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight,
            },
            imageCrop: {
                x: imageX,
                y: imageY,
                width: imageWidth,
                height: imageHeight,
            },
            zoom,
            minZoom: zoom,
            aspectRatio,
        };
    };

    protected drawImage() {
        const state = this.store.get();
        const image = this.image!;
        const crop = state.crop;
        const imageCrop = state.imageCrop;
        const ctx = this.ctx;

        const horizontalMargin = 24;
        const topMargin = 152;

        const zoom = state.zoom;
        const angle = state.angle;
        const rad = angle * Math.PI / 180;
        const flipX = state.flipX ? -1 : 1;
        const flipY = state.flipY ? -1 : 1;

        const x = state.imageCrop.x + 24;
        const y = state.imageCrop.y + 152;
        const w = image.width * zoom;
        const h = image.height * zoom;

        const cropLeft = Math.ceil(crop.x + horizontalMargin);
        const cropRight = Math.ceil(cropLeft + crop.width);
        const cropTop = crop.y + topMargin;
        const cropBottom = cropTop + crop.height;

        const translateImageX = (imageCrop.x + horizontalMargin + (imageCrop.width * zoom) / 2);
        const translateImageY = (imageCrop.y + topMargin + (imageCrop.height * zoom) / 2);

        // clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();

        // set center of canvas
        ctx.translate(translateImageX, translateImageY);

        ctx.rotate(rad);
        ctx.scale(flipX, flipY);

        // draw image
        ctx.drawImage(image,
            (x - translateImageX) * flipX,
            (y - translateImageY) * flipY,
            w * flipX,
            h * flipY,
        );

        ctx.restore();

        // darken background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';

        ctx.fillRect(
            0,
            0,
            cropLeft,
            this.canvas.height,
        );
        ctx.fillRect(
            cropRight,
            0,
            this.canvas.width,
            this.canvas.height,
        );
        ctx.fillRect(
            cropLeft,
            0,
            Math.ceil(crop.width),
            cropTop,
        );
        ctx.fillRect(
            cropLeft,
            cropBottom,
            Math.ceil(crop.width),
            this.canvas.height,
        );
    }

    public move = (cursor: { x: number, y: number }) => {
        if (this.dragged) {
            if (['lt', 'rt', 'lb', 'rb'].indexOf(this.dragged.type) > -1) {
                this.dragCropperMove(cursor)
            } else {
                this.dragImageMove(cursor);
            }
        }

        return null;
    };

    public dragCropperStart = (type: Exclude<DragItemType, 'image'>, start: { x: number, y: number }) => {
        this.dragged = {type, start};
    };
    public dragCropperMove = (target: { x: number, y: number }) => {
        if (this.dragged) {
            const state = this.store.get();

            const {x, y, width, height} = this.moveCropToPos(
                this.dragged.type,
                target,
                state.crop,
                this.area,
                state.aspectRatio,
                state.minSize,
            );

            //     const {
            //         zoom: nextZoom,
            //         cropImage: nextCropImage,
            //     } = this.scaleZoomImage(crop, nextCrop, imageCrop, state.zoom, state.minZoom);

            this.moveCrop(x, y, {width, height});
        }
    };
    public moveCrop = (x: number, y: number, size?: { width: number, height: number; }) => {
        this.changeState({
            crop: {...this.store.get().crop, x, y, ...size},
        });
    };
    protected moveCropToPos = cropMove;

    public dragImageStart = (start: { x: number; y: number; }) => {
        this.dragged = {type: 'image', start};
    };
    public dragImageMove = (target: { x: number; y: number; }) => {
        const state = this.store.get();

        if (this.dragged) {
            const {x, y} = this.moveImageToPos(
                target, this.dragged.start,
                state.crop, state.imageCrop, state.zoom,
            );

            this.dragged!.start = target;

            this.moveImage(x, y);
        }
    };
    public moveImage = (x: number, y: number) => {
        this.changeState({
            imageCrop: {...this.store.get().imageCrop, x, y},
        });
    };
    protected moveImageToPos = imageMove;
    protected scaleZoomImage = cropperImageScale;
    protected imageMoveToAngle = imageMoveToAngle;

    public setDragged = (type: DragItemType, start: { x: number, y: number; }) => {
        this.dragged = {type, start};
    };
    public clearDragged = () => {
        this.dragged = null;
    };

    public zoom = (deltaY: number) => {
        const state = this.store.get();

        const imageCrop = state.imageCrop;
        const crop = state.crop;
        const img = this.image!;

        const prevZoom = state.zoom;
        let zoom = prevZoom - (deltaY / 5000);

        if (zoom < 0.1) {
            return;
        }

        const nextImage = {...state.imageCrop};

        if (deltaY < 0) {
            // инкремент
            const nextImageCrop = this.zoomTo(img, imageCrop, crop, state.zoom, zoom);

            nextImage.x = nextImageCrop.x;
            nextImage.y = nextImageCrop.y;
        } else {
            // декремент

            // let nextImageWidth = imageCrop.width * zoom;
            // let nextImageHeight = imageCrop.height * zoom;

            // если картинка меньше зума, ставим максимально возможный
            // if (nextImageWidth < crop.width) {
            //     zoom = crop.width / imageCrop.width;
            //     nextImageWidth = imageCrop.width * zoom;
            //     nextImageHeight = imageCrop.height * zoom;
            // }
            // if (nextImageHeight < crop.height) {
            //     zoom = crop.height / imageCrop.height;
            //     nextImageWidth = imageCrop.width * zoom;
            //     nextImageHeight = imageCrop.height * zoom;
            // }

            const nextImageCrop = this.zoomTo(img, imageCrop, crop, state.zoom, zoom);

            nextImage.x = nextImageCrop.x;
            nextImage.y = nextImageCrop.y;

            // const nextImageCropToAngle = this.imageMoveToAngle(
            //     crop,
            //     imageCrop,
            //     nextImage,
            //     state.zoom,
            //     nextImageWidth,
            //     nextImageHeight,
            // );
            // nextImage.x = nextImageCropToAngle.x;
            // nextImage.y = nextImageCropToAngle.y;

            // if (nextImageWidth < crop.width) {
            //     return;
            // }
            // if (nextImageHeight < crop.height) {
            //     return;
            // }
        }

        this.changeState({
            imageCrop: nextImage,
            zoom,
        });
    };
    protected zoomTo = cropperZoomTo;

    public rotate = (angle: number) => {
        this.changeState({angle: angle % 360});
    };
    public rotateLeft = () => {
        const state = this.store.get();

        const nextAngle = (state.angle + 90);

        this.rotate(nextAngle);
    };
    public rotateRight = () => {
        const state = this.store.get();

        const nextAngle = (state.angle - 90);

        this.rotate(nextAngle);
    };

    public flipX = (flip?: boolean) => {
        const flipped = typeof flip === 'undefined' ? !this.store.get().flipX : flip;

        this.changeState({flipX: flipped});
    };
    public flipY = (flip?: boolean) => {
        const flipped = typeof flip === 'undefined' ? !this.store.get().flipY : flip;

        this.changeState({flipY: flipped});
    };

    public aspectRatio = (aspectRatio: number | null) => {
        const newConfig = this.getDefaultConfig(aspectRatio);

        this.changeState(newConfig);
    };

    public toBase64 = () => {
        const {crop} = this.store.get();

        return cropImage(this.ctx!, crop);
    }
}

export default CropManager;
