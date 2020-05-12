import React from "react";
export interface CropperTabProps {
    tab: number;
    value: number;
    children: React.ReactNode;
}
declare function CropperTab(props: CropperTabProps): JSX.Element;
export default CropperTab;
