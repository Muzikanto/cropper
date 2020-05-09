import React from 'react';
import BaseCropper from '.';
import Box from "@material-ui/core/Box";
import CustomIcon from "@material-ui/icons/Person";
import {boolean} from "@storybook/addon-knobs";
import CropManager from "./CropManager";

export default {
    title: 'Components',
    parameters: {
        component: BaseCropper,
    },
};

// const img = require('./assets/test.jpg');

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
                src='https://avatars.mds.yandex.net/get-pdb/1615223/277eda7f-642e-4f62-aa8c-9ec66ed5eb9a/s1200'
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
