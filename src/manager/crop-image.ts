import {Crop} from "../CropManager";

function cropImage(ctx: CanvasRenderingContext2D, crop: Crop) {
    const horizontalMargin = 24;
    const topMargin = 152;

    let canvas: HTMLCanvasElement = document.createElement('canvas');
    const lCtx = canvas.getContext('2d')!;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const imageData = ctx.getImageData(
        Math.round(crop.x + horizontalMargin),
        Math.round(crop.y + topMargin),
        crop.width,
        crop.height,
    );

    lCtx.putImageData(imageData, 0, 0);

    const base64 = canvas.toDataURL('image/png');

    return base64;
}

export default cropImage;
