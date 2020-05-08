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

export type CropperAspectRationKeys = 'square' | 'landscape' | 'portrait' | 'free';

const mapValues: { [k in CropperAspectRationKeys]: number | false } = {
    square: 1,
    landscape: 16 / 10,
    portrait: 10 / 16,
    free: false,
};

export const getDefaultAspectRatio = (value?: number | Array<CropperAspectRationKeys | CropperCustomAspectRation>) => {
    if (!value) {
        return false;
    }
    if (typeof value === 'number') {
        return value;
    }
    const first = value[0];

    if (typeof first === 'string') {
        return mapValues[first];
    } else {
        return first.value;
    }
};

const mapRenders: { [k in CropperAspectRationKeys]: CropperCustomAspectRation } = {
    free: {
        icon: <CropFreeIcon/>,
        value: false,
        label: 'Free',
    },
    landscape: {
        icon: <CropLandscapeIcon/>,
        value: 16 / 10,
        label: 'Landscape',
    },
    portrait: {
        icon: <CropPortraitIcon/>,
        value: 10 / 16,
        label: 'Portrait',
    },
    square: {
        icon: <CropSquareIcon/>,
        value: 1,
        label: 'Square',
    },
};

export interface CropperCustomAspectRation {
    icon: JSX.Element;
    label: string;
    // null => free aspectRatio
    value: number | false;
}

export interface CropperAspectRatio {
    className?: string;

    value: number | false;
    onChange?: (value: number | false) => void;

    aspectRatio?: number | Array<CropperAspectRationKeys | CropperCustomAspectRation>;
}

function CropperAspectRatio(props: CropperAspectRatio) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const onOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const onClose = () => setAnchorEl(null);

    const onChange = React.useCallback((value: number | false) => {
        if (props.onChange) {
            props.onChange(value);
        }

        onClose();
    }, [props.onChange]);

    if (!Array.isArray(props.aspectRatio)) {
        return null;
    }

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
                {
                    props.aspectRatio
                        .map((el) => {
                            if (typeof el === "string") {
                                return mapRenders[el];
                            } else {
                                return el;
                            }
                        })
                        .map((el, i) => {
                            return (
                                <Button
                                    key={el.label + i}
                                    className={clsx(classes.btn, {[classes.current]: props.value === el.value})}
                                    startIcon={el.icon}
                                    onClick={() => onChange(el.value)}
                                >{el.label}</Button>
                            )
                        })
                }
            </Popover>
        </>
    )
}

export default React.memo(CropperAspectRatio);
