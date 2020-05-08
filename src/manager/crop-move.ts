import {Crop, DragItemType, Pos2d} from "../CropManager";

function cropMove(
    type: DragItemType,
    cursor: Pos2d,
    crop: Crop,
    area: HTMLDivElement,
    aspectRatio: number | false,
    minSize: { width: number, height: number },
): Crop {
    const minHeight = minSize.height;
    const minWidth = typeof aspectRatio !== "number" ? minSize.width : minHeight * aspectRatio;

    const rect = area.getBoundingClientRect();

    const rawX = cursor.x - rect.left;
    const rawY = cursor.y - rect.top;

    let x = crop.x;
    let y = crop.y;
    let width = crop.width;
    let height = crop.height;

    if (type === 'lt') {
        if (typeof aspectRatio !== 'number') {
            x = rawX < 0 ? 0 : rawX;
            y = rawY < 0 ? 0 : rawY;

            height = crop.height - (y - crop.y);
            width = crop.width - (x - crop.x);
        } else {
            y = rawY < 0 ? 0 : rawY;

            height = crop.height - (y - crop.y);
            width = height * aspectRatio;

            x = crop.x + (crop.width - width)
        }

        if (width < minWidth) {
            x = crop.x;
            width = crop.width;
        }
        if (height < minHeight) {
            y = crop.y;
            height = crop.height;
        }
    } else if (type === 'rt') {
        if (typeof aspectRatio !== 'number') {
            y = rawY < 0 ? 0 : rawY;

            width = rawX - crop.x;
            height = crop.height - (y - crop.y);
        } else {
            y = rawY < 0 ? 0 : rawY;

            height = crop.height - (y - crop.y);
            width = height * aspectRatio;
        }

        if (width < minWidth) {
            width = crop.width;
        }
        if (crop.x + width > rect.width) {
            width = crop.width;
        }
        if (height < minHeight) {
            y = crop.y;
            height = crop.height;
        }
    } else if (type === 'lb') {
        if (typeof aspectRatio !== 'number') {
            x = rawX < 0 ? 0 : rawX;

            width = crop.width - (x - crop.x);
            height = rawY - crop.y;
        } else {
            height = rawY - crop.y;

            // TODO duplicate lines
            if (height < minHeight) {
                height = crop.height;
            }
            if (crop.y + height > rect.height) {
                height = crop.height;
            }

            width = height * aspectRatio;

            x = crop.x + (crop.width - width);
        }

        if (width < minWidth) {
            x = crop.x;
            width = crop.width;
        }
        if (height < minHeight) {
            height = crop.height;
        }
        if (crop.y + height > rect.height) {
            height = crop.height;
        }
    } else if (type === 'rb') {
        if (typeof aspectRatio !== 'number') {
            width = rawX - crop.x;
            height = rawY - crop.y;
        } else {
            height = rawY - crop.y;

            // TODO duplicate lines
            if (height < minHeight) {
                height = crop.height;
            }
            if (crop.y + height > rect.height) {
                height = crop.height;
            }

            width = height * aspectRatio;
        }

        if (width < minWidth) {
            width = crop.width;
        }
        if (crop.x + width > rect.width) {
            width = crop.width;
        }
        if (height < minHeight) {
            height = crop.height;
        }
        if (crop.y + height > rect.height) {
            height = crop.height;
        }
    }

    return {
        width,
        height,
        x,
        y,
    };
}

export default cropMove;