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
  border: "1px solid #DFE1EF",
  paddingTop: 15,
  paddingRight: 20,
  paddingBottom: 15,
  paddingLeft: 25,
  background: theme.white,
  boxShadow: "0 0 1px rgba(0, 0, 0, 0.15), inset 4px 0 0 #D82E1F"
});

const cssCloseButton = css(mixins.buttonReset, {
  label: "close",
  float: "right",
  width: 38,
  height: 38,
  marginLeft: 15,
  padding: 4,
  fill: "#C3C5C8",
  "&:hover": { fill: theme.textColorBluish, cursor: "pointer" },
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

const ErrorOverlay = ({ toggleErrorOverlay }) => (
  <div className={cx(cssErrorOverlay, "meridian-error-overlay")}>
    <div>
      <CloseButton toggleErrorOverlay={toggleErrorOverlay} />
      Error Message Error Message Error Message Error Message Error Message
    </div>
  </div>
);

ErrorOverlay.propTypes = {
  toggleErrorOverlay: PropTypes.func.isRequired
};

export default ErrorOverlay;
