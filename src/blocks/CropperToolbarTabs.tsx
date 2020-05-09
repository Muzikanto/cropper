import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';
import CropIcon from '@material-ui/icons/Crop';
import CropperFilterIcon from './CropperFilterIcon';
import CropperColorsIcon from './CropperColorsIcon';
import ResizeIcon from '@material-ui/icons/PhotoSizeSelectLarge';

const useStyles = makeStyles(() => ({
    tabs: {
        color: 'white',
    },
    tab: {
        '&.MuiTab-root': {
            minWidth: 72,
            marginLeft: 2,
            marginRight: 2,
        },
    },
}), {name: 'Cropper-tabs'});

export interface CropperToolbarTabsProps {
    value: number;
    onChange?: (value: number) => void;
}

function CropperToolbarTabs(props: CropperToolbarTabsProps) {
    const classes = useStyles();

    const onChange = React.useCallback((_, v: number) => {
        if (props.onChange) {
            props.onChange(v);
        }
    }, [props.onChange]);

    return (
        <Tabs
            value={props.value}
            onChange={onChange}
            textColor='inherit'
            className={classes.tabs}
        >
            <Tab
                label='Crop'
                icon={<CropIcon/>}
                className={classes.tab}
            />
            <Tab
                label='Filter'
                icon={<CropperFilterIcon/>}
                className={classes.tab}
            />
            <Tab
                label='Colors'
                icon={<CropperColorsIcon/>}
                className={classes.tab}
            />
            <Tab
                label='Resize'
                icon={<ResizeIcon/>}
                className={classes.tab}
            />
        </Tabs>
    );
}

export default CropperToolbarTabs;
