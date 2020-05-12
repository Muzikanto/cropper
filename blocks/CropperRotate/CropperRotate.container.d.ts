import React from 'react';
export interface CropperRotateProps {
    value: number;
    onChange: (v: number) => void;
}
declare class CropperRotate extends React.Component<CropperRotateProps> {
    cursor: number | null;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    onMouseMove: (e: React.MouseEvent<Element, MouseEvent>) => void;
    onMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
    clearDragged: () => void;
}
export default CropperRotate;
