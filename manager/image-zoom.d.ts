import { Crop } from "../CropManager";
declare function cropperZoomTo(img: HTMLImageElement, imageCrop: Crop, crop: Crop, prevZoom: number, zoom: number): {
    x: number;
    y: number;
};
export default cropperZoomTo;
