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
    image: Pos2d;
    zoom: number;
}

export type DragItemType = 'lt' | 'rt' | 'lb' | 'rb' | 'image';

export type DraggedData = {
    type: DragItemType;
    data: { x: number, y: number; };
}

class CropManager {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement | null = null;
    public area: HTMLDivElement;

    public defaulState: CropManagerState = {
        crop: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        image: {
            x: 0, y: 0,
        },
        zoom: 1,
    };
    public dragged: DraggedData | null = null;
    public state: CropManagerState = {
        crop: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        image: {
            x: 0, y: 0,
        },
        zoom: 1,
    };
    public watch: (config: Crop) => void;

    constructor(canvas: HTMLCanvasElement, area: HTMLDivElement, watcher: (config: Crop) => void) {
        this.canvas = canvas;
        this.area = area;
        this.watch = watcher;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx = ctx;
    }

    protected changeState = (nextState: Partial<CropManagerState>) => {
        this.state = {...this.state, ...nextState};
        this.watch(this.state.crop);
        this.drawImage();
    }

    public loadImage = (src: string) => {
        const image = new Image();
        image.src = src;
        this.image = image;

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
        if (this.image) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.drawImage(
                this.image,
                this.state.image.x + 24,
                this.state.image.y + 152,
                this.image.width * this.state.zoom,
                this.image.height * this.state.zoom,
            );
        }
    }

    public getDefaultConfig = () => {
        if (this.image) {
            const image = this.image;
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
                image: {
                    x,
                    y,
                },
                zoom,
            };
        }

        return this.defaulState;
    }

    public zoomTo = (img: HTMLImageElement, imageCrop: Pos2d, crop: Crop, zoom: number) => {
        const prevWidth = this.image!.width * this.state.zoom;
        const prevHeight = this.image!.height * this.state.zoom;
        const width = this.image!.width * zoom;
        const height = this.image!.height * zoom;

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
        const imageCrop = this.state.image;
        const crop = this.state.crop;

        if (dragged && this.image) {
            if (['lt', 'rt', 'lb', 'rb'].indexOf(dragged.type) > -1) {
                const rect = this.area.getBoundingClientRect();

                const rawX = cursor.x - rect.left;
                const rawY = cursor.y - rect.top;

                const nextImage = {...imageCrop};
                const nextCrop = {...crop};
                let zoom = this.state.zoom;

                // drag angle
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
                const defaultZoom = rect.height / this.image.height;

                const rectWidth = this.round(this.image.width * this.defaulState.zoom * (this.state.zoom / defaultZoom));
                const rectHeight = this.round(this.image.height * this.defaulState.zoom * (this.state.zoom / defaultZoom));

                const imageWidth = this.round(this.image.width * this.state.zoom);
                const imageHeight = this.round(this.image.height * this.state.zoom);

                const diffX = crop.x - nextCrop.x || crop.width - nextCrop.width;
                const diffY = crop.y - nextCrop.y || crop.height - nextCrop.height;

                if (diffX > 0) {
                    if (imageHeight >= rectHeight) {
                        const lWZoom = nextCrop.width / this.image.width;
                        const lHZoom = nextCrop.height / this.image.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageHeight = this.image.height * nextZoom;

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
                        const lWZoom = nextCrop.width / this.image.width;
                        const lHZoom = nextCrop.height / this.image.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageHeight = this.image.height * nextZoom;

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
                        const lWZoom = nextCrop.width / this.image.width;
                        const lHZoom = nextCrop.height / this.image.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageWidth = this.image.width * nextZoom;
                        const nextImageHeight = this.image.height * nextZoom;

                        if (nextCrop.height < imageHeight) {
                            if (nextCrop.y < nextImage.y) {
                                nextImage.y = nextCrop.y;
                            }
                        } else {
                            if (nextImageWidth > rectWidth) {
                                nextImage.x = nextImage.x - (nextImageWidth - imageWidth) / 2;
                                nextImage.y = nextImage.y - (nextImageHeight - imageHeight);
                            }
                        }
                    }
                } else {
                    if (imageWidth >= rectWidth) {
                        const lWZoom = nextCrop.width / this.image.width;
                        const lHZoom = nextCrop.height / this.image.height;
                        const nextZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

                        const nextImageWidth = this.image.width * nextZoom;

                        if (nextCrop.height < imageHeight) {
                            if (nextCrop.y + nextCrop.height > nextImage.y + imageHeight) {
                                nextImage.y = nextImage.y - (crop.height - nextCrop.height);
                            }
                        } else {
                            if (imageWidth > rectWidth) {
                                nextImage.x = nextImage.x - (nextImageWidth - imageWidth) / 2;
                                nextImage.y = nextCrop.y;
                            }
                        }
                    }
                }
                // -----------

                this.changeState({
                    image: nextImage,
                    crop: nextCrop,
                    zoom,
                });
            } else {
                if (dragged.type === 'image') {
                    const nextImage = {...this.state.image};

                    const diffX = cursor.x - dragged.data.x;
                    const diffY = cursor.y - dragged.data.y;

                    const nextX = nextImage.x + diffX;
                    const nextY = nextImage.y + diffY;

                    if (nextX <= crop.x && nextX + this.image.width * this.state.zoom > (crop.x + crop.width)) {
                        nextImage.x = nextX;
                    }
                    if (nextY <= crop.y && nextY + this.image.height * this.state.zoom > (crop.y + crop.height)) {
                        nextImage.y = nextY;
                    }

                    this.dragged!.data = cursor;
                    this.changeState({
                        image: nextImage,
                    });
                }
            }
        }

        return null;
    }

    public zoom = (deltaY: number) => {
        const image = this.state.image;
        const crop = this.state.crop;

        if (this.image) {
            const prevZoom = this.state.zoom;
            let zoom = prevZoom - (deltaY / 5000);

            const nextImage = {...this.state.image};

            if (deltaY < 0) {
                // инкремент
                const nextImageCrop = this.zoomTo(this.image, image, crop, zoom);

                Object.assign(nextImage, nextImageCrop);
            } else {
                // декремент

                const imageWidth = this.image.width * this.state.zoom;
                const imageHeight = this.image.height * this.state.zoom;
                let nextImageWidth = this.image.width * zoom;
                let nextImageHeight = this.image.height * zoom;

                // если картинка меньше зума, ставим максимально возможный
                if (nextImageWidth < crop.width) {
                    zoom = crop.width / this.image.width;
                    nextImageWidth = this.image.width * zoom;
                    nextImageHeight = this.image.height * zoom;
                }
                if (nextImageHeight < crop.height) {
                    zoom = crop.height / this.image.height;
                    nextImageWidth = this.image.width * zoom;
                    nextImageHeight = this.image.height * zoom;
                }

                const nextImageCrop = this.zoomTo(this.image, image, crop, zoom);

                Object.assign(
                    nextImage,
                    nextImageCrop,
                );

                const topDiff = crop.y - image.y;
                const leftDiff = crop.x - image.x;

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
                image: nextImage,
                zoom,
            });
        }
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
}

export default CropManager;
