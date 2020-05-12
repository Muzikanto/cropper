import { Crop, DragItemType, Pos2d } from "../CropManager";
declare function cropMove(type: DragItemType, cursor: Pos2d, crop: Crop, area: HTMLDivElement, aspectRatio: number | false, minSize: {
    width: number;
    height: number;
}): Crop;
export default cropMove;
