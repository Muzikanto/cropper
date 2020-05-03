import React from 'react';
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/styles/makeStyles/makeStyles";

const useStyles = makeStyles(() => ({
    root: {
        height: 56,
        fontSize: 3,
        color: '#ffffff73',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
    },
    scroll: {
        zIndex: 2,
        width: 700,
        overflow: 'hidden',
        mask: 'linear-gradient(90deg,transparent 15%,#000 40%,#000 60%,transparent 85%)',
        userSelect: 'none',
        '&:hover': {
            cursor: 'ew-resize',
        },
        position: 'relative',
    },
    current: {
        top: 0,
        position: 'absolute',
        width: 2,
        height: 10,
        backgroundColor: 'white',
        transform: 'translate(50%, 0)',
    },
    svg: {
        width: 700,
        position: 'absolute',
        left: 0,
        top: 0,
        transform: 'scale(1.2)',
    },
}), {name: 'Cropper-rotate'});

export interface CropperRotateProps {
    angle: number;

    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
}

function CropperRotate(props: CropperRotateProps) {
    const classes = useStyles();

    const left = props.angle * -4.575;

    return (
        <Box className={classes.root}>
            <span className={classes.current}/>
            <div
                className={classes.scroll}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
            >
                <svg
                    viewBox="-90 -5 180 10" className={classes.svg}
                    style={{left}}
                >
                    <circle fill="currentColor" cx="-88" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-90.25" y="3.5">-90°</text>
                    <circle fill="currentColor" cx="-86.04444444444445" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-84.08888888888889" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-82.13333333333334" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-80.17777777777778" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-78.22222222222223" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-80" y="3.5">-80°</text>
                    <circle fill="currentColor" cx="-76.26666666666667" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-74.31111111111112" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-72.35555555555555" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-70.4" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-68.44444444444444" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-70.69444444444444" y="3.5">-70°</text>
                    <circle fill="currentColor" cx="-66.4888888888889" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-64.53333333333333" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-62.57777777777778" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-60.62222222222222" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-58.66666666666667" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-60.91666666666667" y="3.5">-60°</text>
                    <circle fill="currentColor" cx="-56.71111111111111" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-54.75555555555556" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-52.800000000000004" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-50.84444444444445" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-48.88888888888889" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-51.13888888888889" y="3.5">-50°</text>
                    <circle fill="currentColor" cx="-46.93333333333334" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-44.97777777777778" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-43.022222222222226" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-41.06666666666667" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-39.111111111111114" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-41.361111111111114" y="3.5">-40°</text>
                    <circle fill="currentColor" cx="-37.15555555555556" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-35.2" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-33.24444444444445" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-31.28888888888889" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-29.333333333333336" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-31.583333333333336" y="3.5">-30°</text>
                    <circle fill="currentColor" cx="-27.37777777777778" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-25.422222222222224" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-23.46666666666667" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-21.51111111111112" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-19.555555555555557" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-21.805555555555557" y="3.5">-20°</text>
                    <circle fill="currentColor" cx="-17.60000000000001" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-15.644444444444446" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-13.688888888888897" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-11.733333333333334" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-9.777777777777786" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-12.027777777777786" y="3.5">-10°</text>
                    <circle fill="currentColor" cx="-7.822222222222223" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-5.866666666666674" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-3.9111111111111114" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="-1.9555555555555628" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="0" cy="0" r="0.5"/>
                    <text fill="currentColor" x="-0.75" y="3.5">0°</text>
                    <circle fill="currentColor" cx="1.9555555555555486" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="3.9111111111111114" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="5.86666666666666" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="7.822222222222223" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="9.777777777777771" cy="0" r="0.5"/>
                    <text fill="currentColor" x="8.277777777777771" y="3.5">10°</text>
                    <circle fill="currentColor" cx="11.733333333333334" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="13.688888888888883" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="15.644444444444446" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="17.599999999999994" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="19.555555555555557" cy="0" r="0.5"/>
                    <text fill="currentColor" x="18.055555555555557" y="3.5">20°</text>
                    <circle fill="currentColor" cx="21.511111111111106" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="23.46666666666667" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="25.422222222222217" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="27.37777777777778" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="29.33333333333333" cy="0" r="0.5"/>
                    <text fill="currentColor" x="27.83333333333333" y="3.5">30°</text>
                    <circle fill="currentColor" cx="31.28888888888889" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="33.24444444444444" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="35.2" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="37.15555555555555" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="39.1111111111111" cy="0" r="0.5"/>
                    <text fill="currentColor" x="37.6111111111111" y="3.5">40°</text>
                    <circle fill="currentColor" cx="41.06666666666666" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="43.02222222222221" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="44.97777777777776" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="46.93333333333334" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="48.888888888888886" cy="0" r="0.5"/>
                    <text fill="currentColor" x="47.388888888888886" y="3.5">50°</text>
                    <circle fill="currentColor" cx="50.844444444444434" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="52.79999999999998" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="54.75555555555556" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="56.71111111111111" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="58.66666666666666" cy="0" r="0.5"/>
                    <text fill="currentColor" x="57.16666666666666" y="3.5">60°</text>
                    <circle fill="currentColor" cx="60.622222222222206" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="62.57777777777778" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="64.53333333333333" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="66.48888888888888" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="68.44444444444443" cy="0" r="0.5"/>
                    <text fill="currentColor" x="66.94444444444443" y="3.5">70°</text>
                    <circle fill="currentColor" cx="70.4" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="72.35555555555555" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="74.3111111111111" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="76.26666666666665" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="78.22222222222223" cy="0" r="0.5"/>
                    <text fill="currentColor" x="76.72222222222223" y="3.5">80°</text>
                    <circle fill="currentColor" cx="80.17777777777778" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="82.13333333333333" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="84.08888888888887" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="86.04444444444445" cy="0" r="0.2"/>
                    <circle fill="currentColor" cx="88" cy="0" r="0.5"/>
                    <text fill="currentColor" x="86.5" y="3.5">90°</text>
                </svg>
            </div>
        </Box>
    );
}

export default React.memo(CropperRotate);
