import React from 'react';
import UI from './CropperRotate';

export interface CropperRotateProps {

}

export interface CropperRotateState {
    angle: number;
}

class CropperRotate extends React.Component<CropperRotateProps, CropperRotateState> {
    public state = {
        angle: 0,
    };
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
                angle={this.state.angle}
                onMouseMove={this.onMouseMove}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.clearDragged}
            />
        );
    }

    public onMouseMove = (e: React.MouseEvent) => {
        if (this.cursor !== null) {
            const angle = this.state.angle;
            const diff = (this.cursor - e.clientX) / 10;
            const nextAngle = angle + diff;

            if (nextAngle <= 45 && nextAngle >= -45) {
                this.setState({angle: nextAngle});
            }

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
