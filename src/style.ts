/**
 * @internal
 * @packageDocumentation
 */

import createEmotion, { CSSInterpolation } from "@emotion/css/create-instance";

export const theme = {
  fontSizeSmallest: "12px",
  fontSizeSmaller: "14px",
  fontSize: "16px",
  fontSizeBigger: "18px",
  textColor: "#1b1b1b",
  black: "#000",
  white: "#fff",
  almostWhite: "#fafafa",
  textColorBluish: "hsl(208, 17%, 42%)",
  brandOrange: "#ff8300",
  brandBlue: "hsl(203, 100%, 23%)",
  brandBrightBlue: "hsl(207, 65%, 46%)",
  buttonActiveColor: "hsl(201, 55%, 94%)",
  buttonHoverColor: "hsl(200, 60%, 97%)",
  buttonSeparatorColor: "#f0f0f0",
  borderColor: "#ebeef2",
  borderColorDarker: "#dfe1e5",
  borderRadius: 6,
} as const;

export const mixins = {
  flexRow: {
    display: "flex",
    flexDirection: "row",
  } as CSSInterpolation,
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  } as CSSInterpolation,
  overflowEllipses: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as CSSInterpolation,
  textStrokeWhite: {
    WebkitFontSmoothing: "antialiased",
    textShadow: [
      "rgba(255, 255, 255, 0.5) 1px 1px 0",
      "rgba(255, 255, 255, 0.5) -1px -1px 0",
      "white 0 0 1px",
      "white 0 0 2px",
      "white 0 0 3px",
      "white 0 0 4px",
    ].join(", "),
  } as CSSInterpolation,
  buttonReset: {
    padding: 0,
    margin: 0,
    font: "inherit",
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: "inherit",
    "&::-moz-focus-inner": {
      border: 0,
    } as CSSInterpolation,
  } as CSSInterpolation,
  buttonHoverActive: {
    "&:hover": {
      background: theme.buttonHoverColor,
    } as CSSInterpolation,
    "&:active": {
      background: theme.buttonActiveColor,
    } as CSSInterpolation,
  } as CSSInterpolation,
  borderBox: {
    boxSizing: "border-box",
  } as CSSInterpolation,
  focusRing: {
    "&:focus": {
      outline: 0,
      boxShadow: `inset 0 0 0 1px ${theme.brandBrightBlue}`,
    },
  } as CSSInterpolation,
  focusRingMenuItem: {
    "&:focus": {
      outline: 0,
      boxShadow: `
        inset 0 0 0 1px white,
        inset 0 0 0 2px ${theme.brandBrightBlue}
      `,
    },
  } as CSSInterpolation,
  focusOutline: {
    "&:focus": {
      outline: 0,
      boxShadow: "0 0 0 2px currentcolor",
    },
  } as CSSInterpolation,
  focusDarken: {
    "&:focus": {
      outline: 0,
      boxShadow: "inset 0 0 0 9999px rgba(0, 0, 0, 0.1)",
    } as CSSInterpolation,
  } as CSSInterpolation,
  focusNone: {
    "&:focus": {
      outline: "none",
    },
  } as CSSInterpolation,
  shadow: {
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.25)",
  } as CSSInterpolation,
  rounded: {
    borderRadius: theme.borderRadius,
  } as CSSInterpolation,
  maxRounded: {
    borderRadius: 99999,
  } as CSSInterpolation,
  paddingMedium: {
    padding: "20px",
  } as CSSInterpolation,
  pointer: {
    cursor: "pointer",
    "&:disabled": {
      cursor: "default",
    } as CSSInterpolation,
  } as CSSInterpolation,
} as const;

export const {
  // flush,
  // hydrate,
  cx,
  // merge,
  // getRegisteredStyles,
  // injectGlobal,
  keyframes,
  css,
  // sheet,
  // caches
} = createEmotion({ key: "meridian--private-" });
