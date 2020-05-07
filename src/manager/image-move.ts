import {Crop, DraggedData, Pos2d} from "../CropManager";

const ENABLE_LIMIT = false;

function imageMove(cursor: Pos2d, dragged: DraggedData, crop: Crop, imageCrop: Crop, zoom: number): Crop  {
    const nextImageCrop = {...imageCrop};

    const diffX = cursor.x - dragged.data.x;
    const diffY = cursor.y - dragged.data.y;

    const nextX = nextImageCrop.x + diffX;
    const nextY = nextImageCrop.y + diffY;

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
