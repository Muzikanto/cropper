import React from 'react';
import CropManager, { CropManagerState } from "../../CropManager";
import { Store } from "@muzikanto/observable";
import { WithStyles } from "@material-ui/styles";
declare const styles: () => {
    root: {
        height: number;
        display: string;
        justifyContent: string;
        color: string;
    };
    slider: {
        color: string;
        zIndex: number;
        '& > .MuiTypography-root': {
            fontSize: number;
        };
        '& > .MuiSlider-root': {
            color: string;
        };
    };
};
export interface CropperSubBarColorsProps extends WithStyles<typeof styles> {
    store: Store<CropManagerState>;
    manager: CropManager;
}
declare const _default: React.MemoExoticComponent<React.ComponentType<Pick<CropperSubBarColorsProps, "innerRef" | "manager" | "store"> & import("@material-ui/styles").StyledComponentProps<"root" | "slider">>>;
export default _default;
