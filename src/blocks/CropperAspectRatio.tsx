import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import React from 'react';
import CropFreeIcon from '@material-ui/icons/CropFree';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import CropPortraitIcon from '@material-ui/icons/CropPortrait';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    popover: {
        marginTop: 3,
        '& > .MuiPaper-root': {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    btn: {
        '&.MuiButton-root': {
            justifyContent: 'flex-start',
            width: '100%',

            '& > .MuiButton-label': {
                '& > span': {
                    padding: 4,
                },
            },
        },
    },
    current: {
        '&.MuiButton-root': {
            backgroundColor: '#62626257',
        },
    },
}), {name: 'Cropper-aspectRatio'});

const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
} as const;
const transformOrigin = {
    vertical: 'top',
    horizontal: 'center',
} as const;

export interface CropperAspectRatio {
    className?: string;

    value: number | null;
    onChange?: (value: number | null) => void;
}

function CropperAspectRatio(props: CropperAspectRatio) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const onOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const onClose = () => setAnchorEl(null);

    const onChange = React.useCallback((value: number | null) => {
        if (props.onChange) {
            props.onChange(value);
        }

        onClose();
    }, [props.onChange]);

    return (
        <>
            <Button
                className={props.className}
                startIcon={<AspectRatioIcon/>}
                variant='outlined'
                color='inherit'
                onClick={onOpen}
            >Aspect ratio</Button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                className={classes.popover}
            >
                <Button
                    className={clsx(classes.btn, {[classes.current]: props.value === null} )}
                    startIcon={<CropFreeIcon/>}
                    onClick={() => onChange(null)}
                >Free</Button>
                <Button
                    className={clsx(classes.btn, {[classes.current]: props.value === 16 / 10} )}
                    startIcon={<CropLandscapeIcon/>}
                    onClick={() => onChange(16 / 10)}
                >Landscape</Button>
                <Button
                    className={clsx(classes.btn, {[classes.current]: props.value === 10 / 16} )}
                    startIcon={<CropPortraitIcon/>}
                    onClick={() => onChange(10 / 16)}
                >Portrait</Button>
                <Button
                    className={clsx(classes.btn, {[classes.current]: props.value === 1} )}
                    startIcon={<CropSquareIcon/>}
                    onClick={() => onChange(1)}
                >Square</Button>
            </Popover>
        </>
    )
}

export default React.memo(CropperAspectRatio);
