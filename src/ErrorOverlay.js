import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, mixins } from "./style";
import IconClose from "./IconClose";

const cssErrorOverlay = css(mixins.rounded, {
  label: "error",
  position: "absolute",
  zIndex: 4,
  top: "35%",
  left: 0,
  right: 0,
  margin: "0 auto",
  minWidth: 300,
  maxWidth: 420,
  border: "1px solid #dfe1ef",
  paddingTop: 15,
  paddingRight: 20,
  paddingBottom: 15,
  paddingLeft: 25,
  background: theme.white,
  boxShadow: "0 0 1px rgba(0, 0, 0, 0.15), inset 4px 0 0 #d82e1f"
});

const cssCloseButton = css(mixins.buttonReset, {
  label: "close",
  cursor: "pointer",
  float: "right",
  width: 38,
  height: 38,
  marginLeft: 15,
  padding: 4,
  fill: "#c3c5c8",
  "&:hover": {
    fill: theme.textColorBluish,
    cursor: "pointer"
  },
  "&:focus": {
    outline: 0
  }
});

const CloseButton = ({ toggleErrorOverlay }) => (
  <button
    className={cssCloseButton}
    onClick={() => {
      toggleErrorOverlay({ open: false });
    }}
  >
    <IconClose />
  </button>
);

CloseButton.propTypes = {
  toggleErrorOverlay: PropTypes.func.isRequired
};

const ErrorOverlay = ({ toggleErrorOverlay, messages = ["Unknown"] }) => (
  <div className={cssErrorOverlay}>
    <CloseButton toggleErrorOverlay={toggleErrorOverlay} />
    <p>Sorry, something went wrong. It might be related to:</p>
    <ul>
      {messages.map((msg, i) => (
        <li key={i}>{msg}</li>
      ))}
    </ul>
  </div>
);

ErrorOverlay.propTypes = {
  toggleErrorOverlay: PropTypes.func.isRequired,
  messages: PropTypes.array
};

export default ErrorOverlay;
