import {Store} from "@muzikanto/observable";
import getDefaultCropperConfig from "./manager/get-config";
import cropMove from "./manager/crop-move";
import cropperZoomTo from "./manager/image-zoom";
import imageMove from "./manager/image-move";
import cropperImageScale from "./manager/image-scale";
import imageMoveToAngle from "./manager/image-move-angle";

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
    minZoom: number;
    initialChanged: boolean;
    changed: boolean;
    lastChanged: Date | null;
    angle: number;
    flipX: boolean;
    flipY: boolean;
    aspectRatio: number | null;
}

export type DragItemType = 'lt' | 'rt' | 'lb' | 'rb' | 'image';

export type DraggedData = {
    type: DragItemType;
    data: { x: number, y: number; };
}

// TODO
/*
    - scale decrement error
 */

class CropManager {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement | null = null;
    public area: HTMLDivElement;

    public dragged: DraggedData | null = null;
    public store: Store<CropManagerState>;
    public defaultState: CropManagerState;
    public minSize = {
        height: 50,
        width: 50,
    };

    constructor(store: Store<CropManagerState>, canvas: HTMLCanvasElement, area: HTMLDivElement) {
        this.canvas = canvas;
        this.area = area;
        this.store = store;
        this.defaultState = store.get();

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx = ctx;
    }

    protected changeState = (nextState: Partial<CropManagerState>) => {
        const state = this.store.get();

        if (!state.initialChanged) {
            this.store.set({...state, ...nextState, initialChanged: true, lastChanged: new Date()});
        }
        else {
            this.store.set({...state, ...nextState, changed: true, lastChanged: new Date()});
        }

        this.drawImage();
    }

    public loadImage = (src: string) => {
        const image = new Image();

        image.src = src;
        image.onload = () => {
            const defaultConfig = {
                ...this.store.get(),
                ...this.getDefaultConfig(image, this.area, this.store.get().aspectRatio),
            };

            if (0) {
                const savedConfig = localStorage.getItem('test');
                const nextState = JSON.parse(savedConfig as string);

                this.changeState(nextState);
            } else {
                this.changeState(defaultConfig);
            }

            this.defaultState = defaultConfig;
        };

        this.image = image;
    }

    public drawImage() {
        const state = this.store.get();
        const image = this.image!;
        const crop = state.crop;
        const ctx = this.ctx;

        const horizontalMargin = 24;
        const topMargin = 152;

        const zoom = state.zoom;
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
            Math.ceil(crop.width) * flipX,
            cropTop * flipY,
        );
        ctx.fillRect(
            (cropLeft - translateX) * flipX,
            (cropBottom - translateY) * flipY,
            Math.ceil(crop.width) * flipX,
            this.canvas.height * flipY,
        );

        ctx.restore();
    }

    public zoom = (deltaY: number) => {
        const state = this.store.get();

        const imageCrop = state.imageCrop;
        const crop = state.crop;
        const img = this.image!;

        const prevZoom = state.zoom;
        let zoom = prevZoom - (deltaY / 5000);

        const nextImage = {...state.imageCrop};

        if (deltaY < 0) {
            // инкремент
            const nextImageCrop = this.zoomTo(img, imageCrop, crop, state.zoom, zoom);

            Object.assign(nextImage, nextImageCrop);
        } else {
            // декремент

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

            const nextImageCrop = this.zoomTo(img, imageCrop, crop, state.zoom, zoom);

            Object.assign(
                nextImage,
                nextImageCrop,
            );

            this.imageMoveToAngle(
                crop,
                imageCrop,
                nextImage,
                state.zoom,
                nextImageWidth,
                nextImageHeight,
            );

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
            minZoom: zoom,
        });
    }

    public move = (cursor: { x: number, y: number }) => {
        const state = this.store.get();

        const dragged = this.dragged;
        const imageCrop = state.imageCrop;
        const crop = state.crop;

        if (dragged) {
            if (['lt', 'rt', 'lb', 'rb'].indexOf(dragged.type) > -1) {
                const nextCrop = this.moveCrop(dragged.type, cursor, crop, this.area, state.aspectRatio, this.minSize);
                const {
                    zoom: nextZoom,
                    cropImage: nextCropImage,
                } = this.scaleZoomImage(crop, nextCrop, imageCrop, state.zoom, state.minZoom);

                this.changeState({
                    crop: nextCrop,
                    imageCrop: nextCropImage,
                    zoom: nextZoom,
                });
            } else {
                if (dragged.type === 'image') {
                    const nextImage = this.moveImage(cursor, dragged, crop, imageCrop, state.zoom);

                    this.dragged!.data = cursor;
                    this.changeState({
                        imageCrop: nextImage,
                    });
                }
            }
        }

        return null;
    }

    protected scaleZoomImage = cropperImageScale;
    protected imageMoveToAngle = imageMoveToAngle;
    protected moveCrop = cropMove;
    protected moveImage =  imageMove;
    protected getDefaultConfig = getDefaultCropperConfig;
    protected zoomTo = cropperZoomTo;

    public setDragged = (type: DragItemType, data: { x: number, y: number; }) => {
        this.dragged = {type, data};
    }
    public clearDragged = () => {
        this.dragged = null;
    }

    public refreshState = () => {
        this.store.set(this.defaultState);
        this.drawImage();
    }

    public rotate = (angle: number) => {
        this.changeState({angle});
    }
    public rotateLeft = () => {
        const state = this.store.get();

        const nextAngle = (state.angle + 90) % 360;

        this.rotate(nextAngle);
    }

    public rotateRight = () => {
        const state = this.store.get();

        const nextAngle = (state.angle - 90) % 360;

        this.rotate(nextAngle);
    }

    public flipX = () => {
        this.changeState({flipX: !this.store.get().flipX});
    }
    public flipY = () => {
        this.changeState({flipY: !this.store.get().flipY});
    }

    public changeAspectRatio = (aspectRatio: number | null) => {
        const newConfig = this.getDefaultConfig(this.image!, this.area, aspectRatio);

        this.changeState(newConfig);
    }

    public save = () => {
        localStorage.setItem('test', JSON.stringify(this.store.get()));
    }
}

export default CropManager;
