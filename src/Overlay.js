import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, mixins, cx } from "./style";

const cssOverlay = css(mixins.shadow, mixins.rounded, {
  label: "overlay",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  background: theme.white,
  color: theme.textColor,
  fill: "#000",
  position: "absolute",
  margin: 0,
  left: 15,
  top: 15,
  right: 15,
  maxHeight: "calc(100vh - 30px)",
  zIndex: 2,
  maxWidth: 400
});

const cssOverlayLeft = css(cssOverlay, {
  marginRight: "auto"
});

const cssOverlayRight = css(cssOverlay, {
  marginLeft: "auto"
});

const cssClose = css(
  mixins.buttonReset,
  mixins.buttonHoverActive,
  mixins.focusRing,
  {
    label: "overlay-close",
    position: "absolute",
    zIndex: 2,
    top: 10,
    right: 10,
    padding: 4,
    width: 32,
    height: 32,
    fontSize: 11,
    textAlign: "center",
    background: theme.white,
    color: theme.textColor,
    borderRadius: "100%",
    fontWeight: "bold",
    boxShadow: "0 0 1px rgba(0, 0, 0, 0.8)"
  }
);

const CloseButton = ({ onClick }) => (
  <button className={cx(cssClose, "meridian-overlay-close")} onClick={onClick}>
    <svg viewBox="0 0 36 36">
      <path d="M19.41 18l6.36-6.36a1 1 0 0 0-1.41-1.41L18 16.59l-6.36-6.36a1 1 0 0 0-1.41 1.41L16.59 18l-6.36 6.36a1 1 0 1 0 1.41 1.41L18 19.41l6.36 6.36a1 1 0 0 0 1.41-1.41z" />
    </svg>
  </button>
);

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

const Overlay = ({ position, onCloseClicked, children }) => (
  <div
    className={cx(
      position === "left" ? cssOverlayLeft : cssOverlayRight,
      "meridian-overlay",
      `meridian-overlay-${position}`
    )}
  >
    <CloseButton onClick={onCloseClicked} />
    {children}
  </div>
);

Overlay.propTypes = {
  position: PropTypes.oneOf(["left", "right"]).isRequired,
  children: PropTypes.node.isRequired,
  onCloseClicked: PropTypes.func.isRequired
};

export default Overlay;
