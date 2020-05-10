import React from 'react';
import BaseCropper from '.';
import Box from "@material-ui/core/Box";
import CustomIcon from "@material-ui/icons/Person";
import {boolean} from "@storybook/addon-knobs";
import CropManager from "./CropManager";
import {Dialog} from "@material-ui/core";

export default {
    title: 'Components',
    parameters: {
        component: BaseCropper,
    },
};

const img = require('./test.jpg');

export function Cropper() {
    const ref = React.useRef<CropManager>(null);
    const [img, setImg] = React.useState('');

    return (
        <Box p={7}>
            <BaseCropper
                managerRef={(manager) => {
                    // @ts-ignore
                    ref.current = manager;
                }}
                src={img}
                onChange={(v) => setImg(v)}

                flippedX={boolean('flippedX', true)}
                flippedY={boolean('flippedY', true)}
                rotatedLeft={boolean('rotatedLeft', true)}
                rotatedRight={boolean('rotatedRight', true)}
                rotateToAngle={boolean('rotateToAngle', true)}
                sizePreview={boolean('sizePreview', true)}
                aspectRatio={[
                    'free', 'square', 'landscape', 'portrait',
                    {icon: <CustomIcon/>, value: 13 / 10, label: 'custom'},
                ]}

            />
            <img src={img}/>
        </Box>
    );
}

export function CropperDialog() {
    return (
        <Dialog fullScreen open>
            <BaseCropper
                src={img}

                flippedX={boolean('flippedX', true)}
                flippedY={boolean('flippedY', true)}
                rotatedLeft={boolean('rotatedLeft', true)}
                rotatedRight={boolean('rotatedRight', true)}
                rotateToAngle={boolean('rotateToAngle', true)}
                sizePreview={boolean('sizePreview', true)}
                aspectRatio={[
                    'free', 'square', 'landscape', 'portrait',
                    {icon: <CustomIcon/>, value: 13 / 10, label: 'custom'},
                ]}
                container={{width: 1295, height: 754}}
            />
        </Dialog>
    );
}
