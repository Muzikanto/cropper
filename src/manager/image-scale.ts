import {Crop} from "../CropManager";
import cropperRound from "../helpers";

function cropperImageScale(prevCrop: Crop, nextCrop: Crop, imageCrop: Crop, zoom: number, minZoom: number) {
    const nextCropImage = {...imageCrop};
    let nextZoom = zoom;

    const minWidth = cropperRound(imageCrop.width * minZoom);
    const minHeight = cropperRound(imageCrop.height * minZoom);

    const imageWidth = cropperRound(imageCrop.width * zoom);
    const imageHeight = cropperRound(imageCrop.height * zoom);

    const diffX = prevCrop.x - nextCrop.x || nextCrop.width - prevCrop.width;
    const diffY = prevCrop.y - nextCrop.y || nextCrop.height - prevCrop.height;

    if (diffX > 0) {
        if (imageHeight >= minHeight) {
            const lWZoom = nextCrop.width / imageCrop.width;
            const lHZoom = nextCrop.height / imageCrop.height;
            const newZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

            const nextImageHeight = imageCrop.height * newZoom;

            if (nextCrop.width < imageWidth) {
                if (nextCrop.x < nextCropImage.x) {
                    nextCropImage.x = nextCropImage.x + (nextCrop.x - prevCrop.x);
                } else if (nextCrop.x + nextCrop.width > nextCropImage.x + imageWidth) {
                    nextCropImage.x = nextCropImage.x + (nextCrop.width - prevCrop.width);
                }
            } else {
                if (nextImageHeight > minHeight) {
                    nextZoom = newZoom;
                    nextCropImage.x = nextCrop.x;
                    nextCropImage.y = nextCropImage.y - (nextImageHeight - imageHeight) / 2;
                }
            }
        }
    } else if (diffX < 0) {
        if (imageHeight >= minHeight) {
            const lWZoom = nextCrop.width / imageCrop.width;
            const lHZoom = nextCrop.height / imageCrop.height;
            const newZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

            const nextImageWidth = imageCrop.width * newZoom;
            const nextImageHeight = imageCrop.height * newZoom;

            if (nextCrop.width > imageWidth) {
                if (nextCrop.x + nextCrop.width > nextCropImage.x + imageWidth) {
                    nextCropImage.x = nextCropImage.x + (nextCrop.width - prevCrop.width);
                }
            } else {
                if (nextImageHeight > minHeight) {
                    nextZoom = newZoom;
                    nextCropImage.x = nextCropImage.x - (nextImageWidth - imageWidth) / 2;
                    nextCropImage.y = nextCropImage.y - (nextImageHeight - imageHeight) / 2;
                }
            }
        }
    }

    if (diffY > 0) {
        if (imageWidth >= minWidth) {
            const lWZoom = nextCrop.width / imageCrop.width;
            const lHZoom = nextCrop.height / imageCrop.height;
            const newZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

            const nextImageWidth = imageCrop.width * newZoom;

            if (nextCrop.height < imageHeight) {
                if (nextCrop.y < nextCropImage.y) {
                    nextCropImage.y = nextCrop.y;
                } else if (nextCrop.y + nextCrop.height > nextCropImage.y + imageHeight) {
                    nextCropImage.y = nextCropImage.y - (prevCrop.height - nextCrop.height);
                }
            } else {
                if (nextImageWidth > minWidth) {
                    nextZoom = newZoom;
                    nextCropImage.x = nextCropImage.x - (nextImageWidth - imageWidth) / 2;
                    nextCropImage.y = nextCrop.y;
                }
            }
        }
    } else if (diffY < 0) {
        if (imageWidth >= minWidth) {
            const lWZoom = nextCrop.width / imageCrop.width;
            const lHZoom = nextCrop.height / imageCrop.height;
            const newZoom = lWZoom > lHZoom ? lWZoom : lHZoom;

            const nextImageWidth = imageCrop.width * newZoom;

            if (nextCrop.height < imageHeight) {
                if (nextCrop.y + nextCrop.height > nextCropImage.y + imageHeight) {
                    nextCropImage.y = nextCropImage.y - (nextCrop.height - prevCrop.height);
                }
            } else {
                if (nextImageWidth > minWidth) {
                    nextZoom = newZoom;
                    nextCropImage.x = nextCropImage.x - (nextImageWidth - imageWidth) / 2;
                    nextCropImage.y = nextCrop.y;
                }
            }
        }
    }

    return {
        zoom: nextZoom,
        cropImage: nextCropImage,
    }
}

export default cropperImageScale;
