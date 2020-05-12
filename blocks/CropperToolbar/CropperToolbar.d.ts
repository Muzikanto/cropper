/// <reference types="react" />
import { CropManagerState } from "../../CropManager";
import { Store } from "@muzikanto/observable";
export interface CropperToolbarProps {
    store: Store<CropManagerState>;
    tab: number;
    onChangeTab?: (tab: number) => void;
    onDone: () => void;
    onRefresh?: () => void;
}
declare function CropperToolbar(props: CropperToolbarProps): JSX.Element;
export default CropperToolbar;
