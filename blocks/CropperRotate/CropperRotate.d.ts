import React from 'react';
export interface CropperRotateProps {
    angle: number;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
}
declare function CropperRotate(props: CropperRotateProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof CropperRotate>;
export default _default;
