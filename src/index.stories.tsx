import React from 'react';
import BaseCropper from '.';
import Box from "@material-ui/core/Box";
import CustomIcon from "@material-ui/icons/Person";
import {boolean} from "@storybook/addon-knobs";
import {Dialog} from "@material-ui/core";

export default {
    title: 'Components',
    parameters: {
        component: BaseCropper,
    },
};

const imgUrl = require('./test.jpg');

export function Cropper() {
    const [img, setImg] = React.useState('');

    return (
        <Box p={7}>
            <BaseCropper
                src={imgUrl}
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
                src={imgUrl}

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
