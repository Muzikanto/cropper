import React from 'react';
import { CropperAspectRationKeys, CropperCustomAspectRation } from "./blocks/CropperAspectRatio";
import { CropManagerState } from "../../CropManager";
import { Store } from "@muzikanto/observable";
import { WithStyles } from "@material-ui/styles";
declare const styles: () => {
    root: {
        height: number;
        display: string;
        justifyContent: string;
        color: string;
    };
    btn: {
        '&.MuiButton-root': {
            zIndex: number;
            color: string;
            marginLeft: number;
            marginRight: number;
            textTransform: string;
        };
    };
};
export interface CropperSubBarCropProps extends WithStyles<typeof styles> {
    className: string;
    store: Store<CropManagerState>;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onFlipX: () => void;
    onFlipY: () => void;
    onAspectRatio: (value: number | false) => void;
    aspectRatio?: number | Array<CropperAspectRationKeys | CropperCustomAspectRation>;
    flippedX?: boolean;
    flippedY?: boolean;
    flipped?: boolean;
    rotatedLeft?: boolean;
    rotatedRight?: boolean;
    rotate?: boolean;
}
declare const _default: React.MemoExoticComponent<React.ComponentType<Pick<CropperSubBarCropProps, "aspectRatio" | "rotate" | "className" | "innerRef" | "store" | "onRotateLeft" | "onRotateRight" | "onFlipX" | "onFlipY" | "onAspectRatio" | "flippedX" | "flippedY" | "flipped" | "rotatedLeft" | "rotatedRight"> & import("@material-ui/styles").StyledComponentProps<"btn" | "root">>>;
export default _default;
