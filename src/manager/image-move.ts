import {Crop, DraggedData, Pos2d} from "../CropManager";

function imageMove(cursor: Pos2d, dragged: DraggedData, crop: Crop, imageCrop: Crop, zoom: number): Crop  {
    const nextImage = {...imageCrop};

    const diffX = cursor.x - dragged.data.x;
    const diffY = cursor.y - dragged.data.y;

    const nextX = nextImage.x + diffX;
    const nextY = nextImage.y + diffY;

    if (nextX <= crop.x && nextX + imageCrop.width * zoom > (crop.x + crop.width)) {
        nextImage.x = nextX;
    }
    if (nextY <= crop.y && nextY + imageCrop.height * zoom > (crop.y + crop.height)) {
        nextImage.y = nextY;
    }

    return nextImage;
}

export default imageMove;
