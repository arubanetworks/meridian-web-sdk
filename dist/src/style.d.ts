/**
 * @internal
 * @packageDocumentation
 */
export declare const theme: {
    readonly fontSizeSmallest: "12px";
    readonly fontSizeSmaller: "14px";
    readonly fontSize: "16px";
    readonly fontSizeBigger: "18px";
    readonly black: "#000";
    readonly white: "#fff";
    readonly almostWhite: "#fafafa";
    readonly textColor: "#1b1b1b";
    readonly textColorBluishLightGrey: "#9fa8ae";
    readonly textColorBluish: "hsl(208, 17%, 42%)";
    readonly brandOrange: "#ff8300";
    readonly brandBlue: "hsl(203, 100%, 23%)";
    readonly brandBrightBlue: "hsl(207, 65%, 46%)";
    readonly buttonActiveColor: "hsl(201, 55%, 94%)";
    readonly buttonHoverColor: "hsl(200, 60%, 97%)";
    readonly buttonSeparatorColor: "#f0f0f0";
    readonly borderColor: "#ebeef2";
    readonly borderColorDarker: "#dfe1e5";
    readonly borderRadius: 6;
    readonly searchBarColor: "#297BC0";
};
export declare const mixins: {
    readonly flexRow: CSSInterpolation;
    readonly flexColumn: CSSInterpolation;
    readonly overflowEllipses: CSSInterpolation;
    readonly textStrokeWhite: CSSInterpolation;
    readonly buttonReset: CSSInterpolation;
    readonly buttonHoverActive: CSSInterpolation;
    readonly borderBox: CSSInterpolation;
    readonly focusRing: CSSInterpolation;
    readonly focusRingMenuItem: CSSInterpolation;
    readonly focusOutline: CSSInterpolation;
    readonly focusDarken: CSSInterpolation;
    readonly focusNone: CSSInterpolation;
    readonly shadow: CSSInterpolation;
    readonly rounded: CSSInterpolation;
    readonly maxRounded: CSSInterpolation;
    readonly paddingMedium: CSSInterpolation;
    readonly pointer: CSSInterpolation;
};
export declare const cx: (...classNames: import("@emotion/css/create-instance").ClassNamesArg[]) => string, keyframes: {
    (template: TemplateStringsArray, ...args: CSSInterpolation[]): string;
    (...args: CSSInterpolation[]): string;
}, css: {
    (template: TemplateStringsArray, ...args: CSSInterpolation[]): string;
    (...args: CSSInterpolation[]): string;
};
