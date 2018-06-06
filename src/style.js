import createEmotion from "create-emotion";

// TODO: Rename `theme` and `mixins` probably

export const theme = {
  fontFamily: "sans-serif",
  fontSize: "16px",
  white: "#fff",
  brandOrange: "#ff8300",
  brandBlue: "#004876",
  borderColor: "#eaeaea"
};

export const mixins = {
  rounded: {
    borderRadius: "0.25em"
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
