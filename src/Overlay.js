/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, mixins, cx } from "./style";
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
  // TODO: maxHeight should really be based on the Map height mins 30px or so
  maxHeight: 500,
  zIndex: 2,
  maxWidth: 400
});

const cssOverlayLeft = ({ label }) => {
  return cx(
    "meridian-map-overlay",
    label,
    cssOverlay,
    css({
      marginRight: "auto",
      label
    })
  );
};

const cssOverlayRight = ({ label }) => {
  return cx(
    "meridian-map-overlay",
    label,
    cssOverlay,
    css({
      marginLeft: "auto"
    })
  );
};

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
  <button className={cx("close", cssClose)} onClick={onClick}>
    <IconClose />
  </button>
);

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

const Overlay = ({ position, onCloseClicked, children, label }) => (
  <div
    className={
      position === "left"
        ? cssOverlayLeft({ label })
        : cssOverlayRight({ label })
    }
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
