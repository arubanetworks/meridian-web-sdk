import { h } from "preact";
import PropTypes from "prop-types";
import { css } from "./style";

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

const cssZoomButton = css({
  width: 25,
  height: 25,
  border: "1px solid #ccc",
  borderRadius: "3px"
});

const ZoomButton = ({ map, dir }) => (
  <button
    className={`${cssZoomButton} meridian-zoom-button`}
    onClick={dir === "in" ? () => zoomIn(map) : () => zoomOut(map)}
  >
    {dir === "in" ? "+" : "-"}
  </button>
);

ZoomButton.propTypes = {
  map: PropTypes.node,
  dir: PropTypes.oneOf(["in", "out"])
};

const cssSeparator = css({
  paddingTop: 4
});

const Separator = () => <div className={cssSeparator} />;

const cssZoomButtons = css({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  zIndex: 1,
  right: 10,
  top: 10
});

const ZoomButtons = ({ map }) => (
  <div className={cssZoomButtons}>
    <ZoomButton map={map} dir="in" />
    <Separator />
    <ZoomButton map={map} dir="out" />
  </div>
);

ZoomButtons.propTypes = {
  map: PropTypes.node
};

export default ZoomButtons;
