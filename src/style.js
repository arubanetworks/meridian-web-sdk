import createEmotion from "create-emotion";

// TODO: Rename `theme` and `mixins` probably

export const theme = {
  fontFamily: "'Open Sans', helvetica, arial, sans-serif",
  fontSize: "16px",
  black: "#000",
  white: "#fff",
  brandOrange: "#ff8300",
  brandBlue: "#004876",
  brandBrightBlue: "#004876",
  borderColor: "#eaeaea",
  buttonActiveColor: "#f0f0f0",
  buttonHoverColor: "#f8f8f8",
  buttonSeparatorColor: "#f0f0f0"
};

export const mixins = {
  buttonReset: {
    fontFamily: "inherit",
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: "inherit"
  },
  borderBox: {
    boxSizing: "border-box"
  },
  shadow: {
    boxShadow: `
      0 0 0 1px rgba(0, 0, 0, 0.1),
      0 0 8px rgba(0, 0, 0, 0.2)
    `
  },
  rounded: {
    borderRadius: 8
  },
  paddingMedium: {
    padding: "20px"
  }
};

// This doesn't seem strictly necessary based on the docs but idk
const context = typeof global !== "undefined" ? global : {};

// emotion creates a lot of different functions for us, but right now we're only
// using the `css` function, and probably that's the only one we'll really need
// to keep using?
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
