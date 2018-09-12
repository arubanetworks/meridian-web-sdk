import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, cx, mixins } from "./style";
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
  maxWidth: 400,
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
    className={cx(cssCloseButton, "meridian-error-close")}
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

const ErrorOverlay = ({ toggleErrorOverlay, messages }) => (
  <div className={cx(cssErrorOverlay, "meridian-error-overlay")}>
    <CloseButton toggleErrorOverlay={toggleErrorOverlay} />
    <div style={{ paddingBottom: 0 }}>
      <p>Sorry, something went wrong. It might be related to:</p>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  </div>
);

ErrorOverlay.propTypes = {
  toggleErrorOverlay: PropTypes.func.isRequired,
  messages: PropTypes.array
};
ErrorOverlay.defaultProps = {
  messages: ["Unknown"]
};

export default ErrorOverlay;
