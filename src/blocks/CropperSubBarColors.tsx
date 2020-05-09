import React from 'react';
import Toolbar from "@material-ui/core/Toolbar";
import CropManager, {CropManagerState} from "../CropManager";
import {Store} from "@muzikanto/observable";
import withStyles from "@material-ui/core/styles/withStyles";
import {WithStyles} from "@material-ui/styles";
import {Slider, SliderProps} from "@material-ui/core";
import StoreConsumer from "@muzikanto/observable/StoreConsumer";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const styles = () => ({
    root: {
        height: 72,
        display: 'flex',
        justifyContent: 'center',
        color: 'white',
    },
    slider: {
        color: 'white',
        zIndex: 1,
        '& > .MuiTypography-root': {
            fontSize: 14,
        },
        '& > .MuiSlider-root': {
            color: 'white',
        },
    },
});

export interface CropperSubBarColorsProps extends WithStyles<typeof styles> {
    store: Store<CropManagerState>;
    manager: CropManager;
}

function SliderWithLabel({label, className, ...props}: SliderProps<any> & { label: string; }) {
    return (
        <Box display="flex" flexDirection="column" flex={1} marginX={1} alignItems="center" className={className}>
            <Slider{...props} />
            <Typography>{label}</Typography>
        </Box>
    );
}

function CropperSubBarColors(props: CropperSubBarColorsProps) {
    const classes = props.classes;
    const store = props.store;

    return (
        <Toolbar className={classes.root}>
            <StoreConsumer store={store} selector={s => s.filterBrightness}>
                {
                    (value: number) => (
                        <SliderWithLabel
                            min={25} max={175} step={5}
                            value={value}
                            onChange={(_, v) => {
                                props.manager.filterBrightness(v as number)
                            }}
                            className={classes.slider}
                            label="brightness"
                        />
                    )
                }
            </StoreConsumer>
            <StoreConsumer store={store} selector={s => s.filterContrast}>
                {
                    (value: number) => (
                        <SliderWithLabel
                            min={0.25} max={1.75} step={0.05}
                            value={value}
                            onChange={(_, v) => {
                                props.manager.filterContrast(v as number)
                            }}
                            className={classes.slider}
                            label="contrast"
                        />
                    )
                }
            </StoreConsumer>
            <StoreConsumer store={store} selector={s => s.filterSaturate}>
                {
                    (value: number) => (
                        <SliderWithLabel
                            min={25} max={175} step={5}
                            value={value}
                            onChange={(_, v) => {
                                props.manager.filterSaturate(v as number)
                            }}
                            className={classes.slider}
                            label="saturate"
                        />
                    )
                }
            </StoreConsumer>
            <StoreConsumer store={store} selector={s => s.filterGrayScale}>
                {
                    (value: number) => (
                        <SliderWithLabel
                            min={0} max={1} step={0.05}
                            value={value}
                            onChange={(_, v) => {
                                props.manager.filterGrayScale(v as number)
                            }}
                            className={classes.slider}
                            label="grayscale"
                        />
                    )
                }
            </StoreConsumer>
            <StoreConsumer store={store} selector={s => s.filterBlur}>
                {
                    (value: number) => (
                        <SliderWithLabel
                            min={0} max={3} step={0.05}
                            value={value}
                            onChange={(_, v) => {
                                props.manager.filterBlur(v as number)
                            }}
                            className={classes.slider}
                            label="blur"
                        />
                    )
                }
            </StoreConsumer>
        </Toolbar>
    );
}

export default React.memo(withStyles(styles, {name: 'Cropper-subBar'})(CropperSubBarColors));
