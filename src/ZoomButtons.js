import { h } from "preact";
import PropTypes from "prop-types";
import { css } from "./style";

const cssZoomControls = css({
  position: "absolute",
  zIndex: 1,
  right: 10,
  top: 10
});

const cssZoomButton = css({
  width: 25,
  height: 25,
  border: "1px solid #ccc",
  borderRadius: "3px",
  marginBottom: "3px"
});

const zoom = (map, dir) => {
  const currentZoom = map.zoom();
  const zoomStep = 0.15;
  const zoomVal =
    dir === "in" ? currentZoom + zoomStep : currentZoom - zoomStep;
  map.zoom(zoomVal);
};

const zoomIn = map => {
  zoom(map, "in");
};

const zoomOut = map => {
  zoom(map, "out");
};

const ZoomButton = ({ map, dir }) => {
  if (dir === "in") {
    return (
      <button
        className={cssZoomButton}
        onClick={() => {
          zoomIn(map);
        }}
      >
        +
      </button>
    );
  } else {
    return (
      <button
        className={cssZoomButton}
        onClick={() => {
          zoomOut(map);
        }}
      >
        &ndash;
      </button>
    );
  }
};

const ZoomButtons = ({ map }) => {
  return (
    <div className={cssZoomControls}>
      <ZoomButton map={map} dir="in" />
      <br />
      <ZoomButton map={map} dir="out" />
    </div>
  );
};

ZoomButtons.PropTypes = {
  map: PropTypes.node
};

export default ZoomButtons;
