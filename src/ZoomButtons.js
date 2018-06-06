import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme } from "./style";

const cssZoomButtons = css({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  right: 10,
  top: 10,
  "& :focus": { outline: "none" }
});

const styleZoomButton = {
  width: 30,
  height: 29,
  border: `1px solid ${theme.borderColor}`,
  borderRadius: "5px",
  fontSize: 21,
  fontWeight: 200,
  color: `${theme.brandBlue}`,
  background: "white",
  "&:hover": { background: "#f2f2f2" }
};

const cssZoomButtonIn = css({
  ...styleZoomButton,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottom: 0
});

const cssZoomButtonOut = css({
  ...styleZoomButton,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
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
        &ndash;
      </button>
    );
  }
};

ZoomButton.propTypes = {
  map: PropTypes.node,
  dir: PropTypes.oneOf(["in", "out"])
};

const ZoomButtons = ({ map }) => (
  <div className={cssZoomButtons}>
    <ZoomButton map={map} dir="in" />
    <ZoomButton map={map} dir="out" />
  </div>
);

ZoomButtons.propTypes = {
  map: PropTypes.node
};

export default ZoomButtons;
