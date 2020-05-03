import {Crop} from "../CropManager";

function cropperZoomTo(img: HTMLImageElement, imageCrop: Crop, crop: Crop, prevZoom: number, zoom: number) {
    const prevWidth = img.width * prevZoom;
    const prevHeight = img.height * prevZoom;
    const width = img.width * zoom;
    const height = img.height * zoom;

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

export default cropperZoomTo;
