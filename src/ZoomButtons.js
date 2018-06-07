import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme, mixins } from "./style";

const cssZoomButtons = css({
  ...mixins.shadow,
  ...mixins.rounded,
  background: "white",
  overflow: "hidden",
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  right: 10,
  top: 10
});

const styleZoomButton = {
  ...mixins.buttonReset,
  width: 32,
  height: 32,
  border: 0,
  borderRadius: 0,
  fontSize: 20,
  fontWeight: 200,
  color: theme.brandBlue,
  "&:hover": { background: theme.buttonHoverColor },
  "&:active": { background: theme.buttonActiveColor },
  "&:focus": { outline: "none" }
};

const cssZoomButtonIn = css({
  ...styleZoomButton,
  borderBottom: `1px solid ${theme.buttonSeparatorColor}`
});

const cssZoomButtonOut = css({
  ...styleZoomButton
});

const zoom = (map, dir) => {
  const currentZoom = map.zoom();
  const zoomStep = 0.2;
  const zoomVal =
    dir === "in" ? currentZoom + zoomStep : currentZoom - zoomStep;
  map.animate().zoom(zoomVal);
};

const ZoomButton = ({ map, dir }) => {
  if (dir === "in") {
    return (
      <button
        className={`${cssZoomButtonIn} meridian-zoom-button meridian-zoom-button-in`}
        onClick={() => zoom(map, "in")}
      >
        +
      </button>
    );
  } else {
    return (
      <button
        className={`${cssZoomButtonOut} meridian-zoom-button meridian-zoom-button-out`}
        onClick={() => zoom(map, "out")}
      >
        &minus;
      </button>
    );
  }
};

ZoomButton.propTypes = {
  map: PropTypes.node,
  dir: PropTypes.oneOf(["in", "out"])
};

const ZoomButtons = ({ map }) => (
  <div className={`${cssZoomButtons} meridian-zoom-buttons-container`}>
    <ZoomButton map={map} dir="in" />
    <ZoomButton map={map} dir="out" />
  </div>
);

ZoomButtons.propTypes = {
  map: PropTypes.node
};

export default ZoomButtons;
