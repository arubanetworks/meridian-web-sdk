import createEmotion from "create-emotion";

export const theme = {
  fontSize: "16px",
  fontSizeSmaller: "14px",
  textColor: "#1b1b1b",
  black: "#000",
  white: "#fff",
  brandOrange: "#ff8300",
  brandBlue: "hsl(203, 100%, 23%)",
  brandBrightBlue: "hsl(207, 65%, 46%)",
  buttonActiveColor: "hsl(201, 55%, 94%)",
  buttonHoverColor: "hsl(200, 60%, 97%)",
  buttonSeparatorColor: "#f0f0f0",
  borderColor: "#ebeef2",
  borderRadius: 6
};

export const mixins = {
  overflowEllipses: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  textStrokeWhite: {
    WebkitFontSmoothing: "antialiased",
    textShadow: `
      rgba(255, 255, 255, 0.75) 0 0 1px,
      rgba(255, 255, 255, 0.75) 0 0 1px,
      rgba(255, 255, 255, 0.75) 0 0 1px,
      rgba(255, 255, 255, 0.75) 0 0 1px
    `
  },
  buttonReset: {
    padding: 0,
    margin: 0,
    font: "inherit",
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: "inherit",
    "&::-moz-focus-inner": {
      border: 0
    }
  },
  borderBox: {
    boxSizing: "border-box"
  },
  focusRing: {
    "&:focus": {
      outline: 0,
      boxShadow: `inset 0 0 0 1px ${theme.brandBrightBlue}`
    }
  },
  focusRingMenuItem: {
    "&:focus": {
      outline: 0,
      boxShadow: `
        inset 0 0 0 1px white,
        inset 0 0 0 2px ${theme.brandBrightBlue}
      `
    }
  },
  focusOutline: {
    "&:focus": {
      outline: 0,
      boxShadow: "0 0 0 2px currentcolor"
    }
  },
  focusDarken: {
    "&:focus": {
      outline: 0,
      boxShadow: "inset 0 0 0 9999px rgba(0, 0, 0, 0.1)"
    }
  },
  focusNone: {
    "&:focus": {
      outline: "none"
    }
  },
  shadow: {
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.25)"
  },
  rounded: {
    borderRadius: theme.borderRadius
  },
  paddingMedium: {
    padding: "20px"
  },
  pointer: {
    cursor: "pointer",
    "&:disabled": {
      cursor: "default"
    }
  }
};

// This doesn't seem strictly necessary based on the docs but idk
const context = typeof global !== "undefined" ? global : {};

// Feel free to uncomment these as we need more functions from Emotion,
// especially `keyframes` if we need to start doing animations.
export const {
  // flush,
  // hydrate,
  cx,
  // merge,
  // getRegisteredStyles,
  // injectGlobal,
  // keyframes,
  css
  // sheet,
  // caches
} = createEmotion(context, {
  key: "meridian-sdk"
});
