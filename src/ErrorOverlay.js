import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, cx } from "./style";

const cssErrorOverlay = css({
  label: "error",
  background: theme.white,
  color: theme.textColor,
  position: "absolute",
  top: 55,
  zIndex: 4,
  maxWidth: 400,
  minWidth: 300,
  margin: "0 auto"
});

const ErrorOverlay = ({ toggleErrorOverlay }) => (
  <div className={cx(cssErrorOverlay, "meridian-error-overlay")}>
    <p>Error Message</p>
    <p>
      <button
        onClick={() => {
          toggleErrorOverlay({ open: false });
        }}
      >
        Close Button
      </button>
    </p>
  </div>
);
ErrorOverlay.propTypes = {
  toggleErrorOverlay: PropTypes.func.isRequired
};

export default ErrorOverlay;
