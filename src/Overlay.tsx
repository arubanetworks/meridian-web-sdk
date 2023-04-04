/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import IconClose from "./IconClose";
import { css, mixins, theme, cx } from "./style";

interface OverlayProps {
  position: "left" | "right";
  onCloseClicked: () => void;
}

const Overlay: FunctionComponent<OverlayProps> = ({
  position,
  onCloseClicked,
  children,
}) => (
  <div
    className={cx(
      "meridian-details-overlay",
      position === "left" ? cssOverlayLeft : cssOverlayRight
    )}
    data-testid="meridian--private--map-overlay"
  >
    <button
      className={cssClose}
      onClick={onCloseClicked}
      data-testid="meridian--private--close-overlay"
    >
      <IconClose />
    </button>
    {children}
  </div>
);

const cssOverlay = css(mixins.shadow, mixins.rounded, {
  label: "details-overlay",
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
  maxHeight: 600,
  zIndex: 2,
  maxWidth: 400,
});

const cssOverlayLeft = css(cssOverlay, {
  marginRight: "auto",
});

const cssOverlayRight = css(cssOverlay, {
  marginLeft: "auto",
});

const cssClose = css(
  mixins.buttonReset,
  mixins.buttonHoverActive,
  mixins.focusRing,
  {
    label: "details-overlay-close",
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
    boxShadow: "0 0 2px rgba(0, 0, 0, 0.4)",
  }
);

export default Overlay;
