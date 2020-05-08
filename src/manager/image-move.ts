import {Crop, Pos2d} from "../CropManager";

function imageMove(start: Pos2d, target: Pos2d, crop: Crop, imageCrop: Crop, zoom: number): Crop {
    const nextImageCrop = {...imageCrop};

    const diffX = start.x - target.x;
    const diffY = start.y - target.y;

    const nextX = nextImageCrop.x + diffX;
    const nextY = nextImageCrop.y + diffY;

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
