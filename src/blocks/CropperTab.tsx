import React from "react";

export interface CropperTabProps {
    tab: number;
    value: number;
    children: React.ReactNode;
}

function CropperTab(props: CropperTabProps) {
    const {children, value, tab, ...other} = props;

    return (
        <div
            role="tab-panel"
            hidden={tab !== value}
            aria-labelledby={`simple-tab-${value}`}
            {...other}
        >
            {tab === value && (
                <>
                    {children}
                </>
            )}
        </div>
    );
}

export default CropperTab;
