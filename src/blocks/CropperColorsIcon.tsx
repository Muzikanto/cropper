import React from 'react';
import {SvgIconProps} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

function CropperColorsIcon(props: SvgIconProps) {
    return (
        <SvgIcon width="24" height="24" viewBox="0 0 24 24" {...props}>
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 1v5.5m0 3.503V23M12 1v10.5m0 3.5v8M20 1v15.5m0 3.5v3M2 7h4M10 12h4M18 17h4"/>
            </g>
        </SvgIcon>
    );
}

export default React.memo(CropperColorsIcon);
