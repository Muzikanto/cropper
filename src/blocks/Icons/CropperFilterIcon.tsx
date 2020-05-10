import React from 'react';
import {SvgIconProps} from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

function CropperFilterIcon(props: SvgIconProps) {
    return (
        <SvgIcon width="24" height="24" viewBox="0 0 24 24"{...props}>
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
               strokeLinejoin="round">
                <path d="M18.347 9.907a6.5 6.5 0 1 0-1.872 3.306M3.26 11.574a6.5 6.5 0 1 0 2.815-1.417"/>
                <path d="M10.15 17.897A6.503 6.503 0 0 0 16.5 23a6.5 6.5 0 1 0-6.183-8.51"/>
            </g>
        </SvgIcon>
    );
}

export default React.memo(CropperFilterIcon);
