import React from 'react';
import UI from './CropperRotate';

export interface CropperRotateProps {
    value: number;
    onChange: (v: number) => void;
}

class CropperRotate extends React.Component<CropperRotateProps> {
    public cursor: number | null = null;

    public componentDidMount() {
        document.addEventListener<any>('mousemove', this.onMouseMove);
        document.addEventListener<any>('mouseleave', this.clearDragged);
        document.addEventListener<any>('mouseup', this.clearDragged);
    }

    public componentWillUnmount() {
        document.removeEventListener<any>('mousemove', this.onMouseMove);
        document.removeEventListener<any>('mouseleave', this.clearDragged);
        document.removeEventListener<any>('mouseup', this.clearDragged);
    }

    public render() {
        return (
            <UI
                angle={this.props.value}
                onMouseMove={this.onMouseMove}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.clearDragged}
            />
        );
    }

    public onMouseMove = (e: React.MouseEvent) => {
        if (this.cursor !== null) {
            const angle = this.props.value;
            const diff = (this.cursor - e.clientX) / 10;
            const nextAngle = angle + diff;

            // if (nextAngle <= 45 && nextAngle >= -45) {
                this.props.onChange(nextAngle);
            // }

            this.cursor = e.clientX;
        }
    }

    public onMouseDown = (e: React.MouseEvent) => {
        this.cursor = e.clientX;
    }
    public clearDragged = () => {
        this.cursor = null;
    }
}

export default CropperRotate;
