import React from 'react';
import BasePicture from './index';
import Cropper from '.';
import Box from "@material-ui/core/Box";
import CustomIcon from "@material-ui/icons/Person";

export default {
    title: 'Components',
    parameters: {
        component: BasePicture,
    },
};

// const img = require('./assets/test.jpg');

export function Picture() {
    const [img, setImg] = React.useState('');

    return (
        <Box p={7}>
            <Cropper
                src='https://avatars.mds.yandex.net/get-pdb/1615223/277eda7f-642e-4f62-aa8c-9ec66ed5eb9a/s1200'
                onChange={(v) => setImg(v)}

                flippedX
                flippedY
                rotatedLeft
                rotatedRight
                rotateToAngle
                aspectRatio={[
                    'free', 'square', 'landscape', 'portrait',
                    {icon: <CustomIcon/>, value: 13 / 10, label: 'custom'},
                ]}
            />
            <img src={img}/>
        </Box>
    );
}
