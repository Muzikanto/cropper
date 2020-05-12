import { Crop } from "../CropManager";
declare function cropperImageScale(prevCrop: Crop, nextCrop: Crop, imageCrop: Crop, zoom: number, minZoom: number): {
    zoom: number;
    cropImage: {
        width: number;
        height: number;
        x: number;
        y: number;
    };
};
export default cropperImageScale;
