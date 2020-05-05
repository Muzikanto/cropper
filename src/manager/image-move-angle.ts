import {Crop} from "../CropManager";

function imageMoveToAngle(crop: Crop, prevImageCrop: Crop, nextImageCrop: Crop, zoom: number, nextWidth: number, nextHeight: number) {
    const nextImageWidth = nextWidth;
    const nextImageHeight = nextHeight;

    const imageWidth = prevImageCrop.width * zoom;
    const imageHeight = prevImageCrop.height * zoom;

    const nextImage = nextImageCrop;

    const topDiff = crop.y - prevImageCrop.y;
    const leftDiff = crop.x - prevImageCrop.x;

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

    return nextImage;
}

export default imageMoveToAngle;