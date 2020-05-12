import React from 'react';
import { CropManagerState, DragItemType } from "../CropManager";
import { Store } from "@muzikanto/observable";
import { WithStyles } from "@material-ui/styles";
declare const styles: () => {
    readonly root: {
        readonly zIndex: 1;
        readonly userSelect: "none";
        readonly margin: "4px 24px 24px 24px";
        readonly position: "relative";
        readonly cursor: "move";
    };
    readonly grid: {
        readonly boxSizing: "border-box";
        readonly position: "absolute";
        readonly border: "solid 1px white";
    };
    readonly circle: {
        readonly zIndex: 1;
        readonly position: "absolute";
        readonly width: 50;
        readonly height: 50;
        readonly borderRadius: "50%";
        readonly cursor: "pointer";
        readonly display: "flex";
        readonly justifyContent: "center";
        readonly alignItems: "center";
    };
    readonly circleIcon: {
        readonly background: "white";
        readonly width: 20;
        readonly height: 20;
        readonly borderRadius: "50%";
    };
    readonly line: {
        readonly position: "absolute";
        readonly background: "#f7f7f799";
    };
    readonly circle_lt: {
        readonly left: 0;
        readonly top: 0;
        readonly transform: "translate(-50%, -50%)";
        readonly cursor: "nwse-resize";
    };
    readonly circle_rt: {
        readonly right: 0;
        readonly top: 0;
        readonly transform: "translate(50%, -50%)";
        readonly cursor: "nesw-resize";
    };
    readonly circle_lb: {
        readonly left: 0;
        readonly bottom: 0;
        readonly transform: "translate(-50%, 50%)";
        readonly cursor: "nesw-resize";
    };
    readonly circle_rb: {
        readonly right: 0;
        readonly bottom: 0;
        readonly transform: "translate(50%, 50%)";
        readonly cursor: "nwse-resize";
    };
    readonly size: {
        readonly position: "absolute";
        readonly right: 10;
        readonly bottom: 10;
        readonly padding: "1px 5px";
        readonly backgroundColor: "white";
        readonly borderRadius: 3;
        readonly fontSize: 13;
    };
    readonly size_bottom: {
        readonly bottom: -30;
        readonly minWidth: "max-content";
        readonly right: "50%";
        readonly transform: "translate(50%, 0)";
    };
};
export interface CropperGridProps extends WithStyles<typeof styles> {
    store: Store<CropManagerState>;
    onMouseDown: (type: DragItemType, start: {
        x: number;
        y: number;
    }) => void;
    onMouseUp: () => void;
    areaRef: (ref: HTMLDivElement) => void;
    gridRef: (ref: HTMLDivElement) => void;
    rotateToAngle?: boolean;
    sizePreview?: boolean;
}
declare const _default: React.MemoExoticComponent<React.ComponentType<Pick<CropperGridProps, "onMouseDown" | "onMouseUp" | "store" | "areaRef" | "gridRef" | "rotateToAngle" | "sizePreview"> & import("@material-ui/styles").StyledComponentProps<"grid" | "size" | "circle" | "line" | "root" | "circleIcon" | "circle_lt" | "circle_rt" | "circle_lb" | "circle_rb" | "size_bottom"> & object>>;
export default _default;
