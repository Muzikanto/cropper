import {Crop} from "./index";

class CropManager {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement | null = null;
    public area: HTMLDivElement | null = null;

    constructor(canvas: HTMLCanvasElement, area: HTMLDivElement) {
        this.canvas = canvas;
        this.area = area;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx = ctx;
    }

    protected loadImage = (src: string) => {
        const image = new Image();
        image.src = src;
        this.image = image;

        image.onload = () => {
            const config = this.getDefaultConfig();

            // this.onChange(config);
            // const t = localStorage.getItem('test');
            // if (t) {
            //     this.onChange(JSON.parse(t));
            // }
        };
    }

    protected getDefaultConfig = () => {
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
                    y: 0,
                    width,
                    height: 296,
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

        return null;
    }

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
            width: Math.round(width * 1000) / 1000,
            height: Math.round(height * 1000) / 1000,
        };
    }
}

export default CropManager;
