import React from 'react';
export declare type CropperAspectRationKeys = 'square' | 'landscape' | 'portrait' | 'free';
export declare const getDefaultAspectRatio: (value?: number | ("square" | "landscape" | "portrait" | "free" | CropperCustomAspectRation)[] | undefined) => number | false;
export interface CropperCustomAspectRation {
    icon: JSX.Element;
    label: string;
    value: number | false;
}
export interface CropperAspectRatio {
    className?: string;
    value: number | false;
    onChange?: (value: number | false) => void;
    aspectRatio?: number | Array<CropperAspectRationKeys | CropperCustomAspectRation>;
}
declare function CropperAspectRatio(props: CropperAspectRatio): JSX.Element | null;
declare const _default: React.MemoExoticComponent<typeof CropperAspectRatio>;
export default _default;
