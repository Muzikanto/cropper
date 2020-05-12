import { Crop } from "../CropManager";
declare function imageMoveToAngle(crop: Crop, prevImageCrop: Crop, nextImageCrop: Crop, zoom: number, nextWidth: number, nextHeight: number): {
    width: number;
    height: number;
    x: number;
    y: number;
};
export default imageMoveToAngle;
