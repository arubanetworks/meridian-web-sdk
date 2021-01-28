/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, mixins } from "./style";
import IconClose from "./IconClose";

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
  // TODO: maxHeight should really be based on the Map height minus 30px or so
  maxHeight: 500,
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
    cursor: "pointer",
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
    boxShadow: "0 0 2px rgba(0, 0, 0, 0.4)"
  }
);

const CloseButton = ({ onClick }) => (
  <button
    className={cssClose}
    onClick={onClick}
    data-testid="meridian--private--close-overlay"
  >
    <IconClose />
  </button>
);

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

const Overlay = ({ position, onCloseClicked, children }) => (
  <div
    className={position === "left" ? cssOverlayLeft : cssOverlayRight}
    data-testid="meridian--private--map-overlay"
  >
    <CloseButton onClick={onCloseClicked} />
    {children}
  </div>
);

Overlay.propTypes = {
  position: PropTypes.oneOf(["left", "right"]).isRequired,
  children: PropTypes.any.isRequired,
  onCloseClicked: PropTypes.func.isRequired,
  label: PropTypes.string
};

export default Overlay;
