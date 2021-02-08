/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, cx, mixins, theme } from "./style";

interface ZoomControlsProps {
  onZoomIn: (event: MouseEvent) => void;
  onZoomOut: (event: MouseEvent) => void;
}

const ZoomControls: FunctionComponent<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut
}) => (
  <div className={cx("meridian-zoom-controls", cssZoomControls)}>
    <ZoomButton onClick={onZoomIn} dir="in" />
    <ZoomButton onClick={onZoomOut} dir="out" />
  </div>
);

interface ZoomButtonProps {
  onClick?: (event: MouseEvent) => void;
  dir: "in" | "out";
}

const ZoomButton: FunctionComponent<ZoomButtonProps> = ({ onClick, dir }) => {
  if (dir === "in") {
    return (
      <button
        className={cx(
          "meridian-zoom-button",
          "meridian-zoom-button-in",
          cssZoomButtonIn
        )}
        data-testid="meridian--private--zoom-button-in"
        onClick={onClick}
      >
        <svg viewBox="0 0 36 36">
          <path d="M26 17h-7v-7a1 1 0 0 0-2 0v7h-7a1 1 0 0 0 0 2h7v7a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2" />
        </svg>
      </button>
    );
  }
  return (
    <button
      className={cx(
        "meridian-zoom-button",
        "meridian-zoom-button-out",
        cssZoomButtonOut
      )}
      data-testid="meridian--private--zoom-button-out"
      onClick={onClick}
    >
      <svg viewBox="0 0 36 36">
        <path d="M26 19H10a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2" />
      </svg>
    </button>
  );
};

const cssZoomControls = css(mixins.shadow, mixins.rounded, {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  right: 15,
  bottom: 15
});

const cssZoomButton = css(
  mixins.buttonReset,
  mixins.focusRing,
  mixins.buttonHoverActive,
  mixins.rounded,
  {
    cursor: "pointer",
    padding: 4,
    width: 40,
    height: 40,
    border: 0,
    fontSize: 20,
    fontWeight: 200,
    fill: theme.brandBrightBlue,
    background: "white"
  }
);

const cssZoomButtonIn = css(cssZoomButton, {
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottom: `1px solid ${theme.buttonSeparatorColor}`
});

const cssZoomButtonOut = css(cssZoomButton, {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
});

export default ZoomControls;
