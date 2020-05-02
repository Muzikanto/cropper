import {Crop} from "./index";

export interface CropManagerState {
    crop: Crop;
    image: Crop;
    zoom: number;
}

class CropManager {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement | null = null;
    public area: HTMLDivElement | null = null;

    public defaulState: CropManagerState = {
        crop: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        image: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        zoom: 1,
    };
    public dragged: 1 | 2 | 3 | 4 | null = null;
    public state: CropManagerState = {
        crop: {
            x: 0, y: 0,
            width: 296, height: 296,
        },
        image: {
            x: 0, y: 0,
            width: 296, height: 296,
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
                this.state.image.width,
                this.state.image.height,
            );
        }
    }

    public getDefaultConfig = () => {
        if (this.area && this.image) {
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
                    width,
                    height,
                },
                zoom,
            };
        }

        return this.defaulState;
    }

    public zoomTo = (img: HTMLImageElement, imageCrop: Crop, crop: Crop, zoom: number): Crop => {
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
            width: Math.round(width * 1000) / 1000,
            height: Math.round(height * 1000) / 1000,
        };
    }

    public move = (cursor: { x: number, y: number }) => {
        const dragged = this.dragged;
        const imageCrop = this.state.image;
        const crop = this.state.crop;

        if (dragged && this.area && this.image) {
            const rect = this.area.getBoundingClientRect();

            const rawX = cursor.x - rect.left;
            const rawY = cursor.y - rect.top;

            const nextImage = {...imageCrop};
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

            const defaultZoom = rect.height / this.image.height;

            const rectWidth = Math.round(this.defaulState.image.width * (this.state.zoom / defaultZoom) * 1000) / 1000;
            const rectHeight = Math.round(this.defaulState.image.height * (this.state.zoom / defaultZoom) * 1000) / 1000;

            const diffX = crop.x - nextCrop.x;
            const diffY = crop.y - nextCrop.y;

            // растягиваем по диалогали
            if (diffX > 0) {
                if (imageCrop.height >= rectHeight) {
                    const lZoom = nextCrop.width / nextImage.width;
                    const imageWidth = nextImage.width * lZoom;
                    const imageHeight = nextImage.height * lZoom;

                    if (imageHeight > rectHeight) {
                        nextImage.width = imageWidth;
                        nextImage.height = imageHeight;
                        nextImage.x = nextImage.x - (imageWidth - imageCrop.width);
                        nextImage.y = nextImage.y - (imageHeight - imageCrop.height) / 2;
                    } else {
                        if (nextCrop.x < nextImage.x && nextCrop.width < nextImage.width) {
                            nextImage.x = nextCrop.x;
                            // nextImage.y = nextCrop.y - (nextImage.height - image.height) / 2;
                        }
                    }
                }
            }
            // сжимаем по диагонали
            else {
                if (imageCrop.height >= rectHeight) {
                    const lZoom = nextCrop.width / nextImage.width;
                    const imageWidth = nextImage.width * lZoom;
                    const imageHeight = nextImage.height * lZoom;

                    if (imageHeight > rectHeight) {
                        nextImage.width = imageWidth;
                        nextImage.height = imageHeight;
                        nextImage.x = nextCrop.x;
                        nextImage.y = nextImage.y - (imageHeight - imageCrop.height) / 2;
                    } else {
                        if (nextCrop.x + nextCrop.width > nextImage.x + nextImage.width && nextCrop.width < nextImage.width) {
                            nextImage.x = nextImage.x + (nextCrop.width - crop.width);
                            // nextImage.y = nextCrop.y - (nextImage.height - image.height) / 2;
                        }
                    }
                }
            }

            // растягиваем по вертикали
            if (diffY > 0) {
                if (imageCrop.width >= rectWidth) {
                    const lZoom = nextCrop.height / nextImage.height;
                    const imageWidth = nextImage.width * lZoom;
                    const imageHeight = nextImage.height * lZoom;

                    if (imageWidth > rectWidth) {
                        nextImage.width = imageWidth;
                        nextImage.height = imageHeight;
                        nextImage.x = nextImage.x - (imageWidth - imageCrop.width) / 2;
                        nextImage.y = nextImage.y - (imageHeight - imageCrop.height);
                    } else {
                        if (nextCrop.y < nextImage.y && nextCrop.height < nextImage.height) {
                            nextImage.y = nextCrop.y;
                        }
                    }
                }
            }
            // сжимаем по вертикали
            else {
                if (imageCrop.width >= rectWidth) {
                    const lZoom = nextCrop.height / nextImage.height;
                    const imageWidth = nextImage.width * lZoom;
                    const imageHeight = nextImage.height * lZoom;

                    if (imageWidth > rectWidth) {
                        nextImage.width = imageWidth;
                        nextImage.height = imageHeight;
                        nextImage.x = nextImage.x - (imageWidth - imageCrop.width) / 2;
                        nextImage.y = nextCrop.y;
                    } else {
                        if (nextCrop.y + nextCrop.height > nextImage.y + nextImage.height && nextCrop.height < nextImage.height) {
                            nextImage.y = nextImage.y - (nextCrop.height - crop.height);
                        }
                    }
                }
            }

            this.changeState({
                image: nextImage,
                crop: nextCrop,
            });
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

                // если картинка меньше зума, ставим максимально возможный
                if (this.image.width * zoom < crop.width) {
                    zoom = crop.width / this.image.width;
                }
                if (this.image.height * zoom < crop.height) {
                    zoom = crop.height / this.image.height;
                }

                const nextImageCrop = this.zoomTo(this.image, image, crop, zoom);

                Object.assign(
                    nextImage,
                    nextImageCrop,
                );

                const topDiff = crop.y - image.y;
                const leftDiff = crop.x - image.x;

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

            this.changeState({
                image: nextImage,
                zoom,
            });
        }
    }

    protected bind = () => {

    }

    public setDragged = (drag: 1 | 2 | 3 | 4) => {
        this.dragged = drag;
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
}

export default CropManager;
