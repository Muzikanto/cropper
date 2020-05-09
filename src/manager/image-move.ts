import {Crop, Pos2d} from "../CropManager";

function rotateVector(vector: { x: number; y: number }, angle: number) {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
    }
}

function imageMove(start: Pos2d, target: Pos2d, crop: Crop, imageCrop: Crop, zoom: number, angle: number): Crop {
    const nextImageCrop = {...imageCrop};

    const rad = angle * Math.PI / 180;

    const diffX = start.x - target.x;
    const diffY = start.y - target.y;

    const r = rotateVector({x: diffX, y: diffY}, -rad);

    const nextX = nextImageCrop.x + r.x;
    const nextY = nextImageCrop.y + r.y;

    // if (nextX <= crop.x && nextX + imageCrop.width * zoom > (crop.x + crop.width)) {
    //     nextImageCrop.x = nextX;
    // }
    // if (nextY <= crop.y && nextY + imageCrop.height * zoom > (crop.y + crop.height)) {
    //     nextImageCrop.y = nextY;
    // }

    nextImageCrop.x = nextX;
    nextImageCrop.y = nextY;

    return nextImageCrop;
}

export default imageMove;
