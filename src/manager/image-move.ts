import {Crop, DraggedData, Pos2d} from "../CropManager";

const ENABLE_LIMIT = false;

export function rotateVector(vector: { x: number; y: number }, angle: number) {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
    }
}

function imageMove(cursor: Pos2d, dragged: DraggedData, crop: Crop, imageCrop: Crop, zoom: number, angle: number): Crop  {
    const nextImageCrop = {...imageCrop};

    const rad = (-angle) * Math.PI / 180;
    const diffX = cursor.x - dragged.data.x;
    const diffY = cursor.y - dragged.data.y;

    const rotatedDiff = rotateVector({x: diffX, y: diffY}, rad);

    const nextX = nextImageCrop.x + rotatedDiff.x;
    const nextY = nextImageCrop.y + rotatedDiff.y;

    if (ENABLE_LIMIT) {
        if (nextX <= crop.x && nextX + imageCrop.width * zoom > (crop.x + crop.width)) {
            nextImageCrop.x = nextX;
        }
        if (nextY <= crop.y && nextY + imageCrop.height * zoom > (crop.y + crop.height)) {
            nextImageCrop.y = nextY;
        }
    } else {
        nextImageCrop.x = nextX;
        nextImageCrop.y = nextY;
    }

    return nextImageCrop;
}

export default imageMove;
