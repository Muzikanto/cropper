import React from 'react';
import BasePicture from './index';
import Cropper from '.';
import {Box} from "@material-ui/core";

export default {
    title: 'Components',
    parameters: {
        component: BasePicture,
    },
};

// const img = require('./assets/test.jpg');

export function Picture() {
    return (
        <Box p={7}>
            <Cropper
                src='https://avatars.mds.yandex.net/get-pdb/1615223/277eda7f-642e-4f62-aa8c-9ec66ed5eb9a/s1200'
            />
        </Box>
    );
}
