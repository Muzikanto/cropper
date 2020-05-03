import {CropManagerState} from "../CropManager";

function getDefaultCropperConfig(image: HTMLImageElement, area: HTMLDivElement, aspectRatio: number | null):
    Pick<CropManagerState, 'crop' | 'imageCrop' | 'zoom' | 'aspectRatio' | 'minZoom'> {
    const rect = area.getBoundingClientRect();

    let zoom = aspectRatio ?
        aspectRatio > 1 ?
            (rect.height * aspectRatio) / image.width
            : rect.height / image.height
        : rect.height / image.height;
    let cropWidth = aspectRatio ? rect.height * aspectRatio : image.width * zoom;
    let cropHeight = aspectRatio ? rect.height : image.height * zoom;

    const cropX = (rect.width / 2) - cropWidth / 2;
    const cropY = 0;

    const imageWidth = image.width;
    const imageHeight = image.height;
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
}

export default getDefaultCropperConfig;
