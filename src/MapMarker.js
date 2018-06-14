import { h } from "preact";
import PropTypes from "prop-types";
import Tag from "./Tag";

const MapMarker = ({
  kind,
  mac,
  x,
  y,
  data,
  mapZoomFactor,
  onClick = () => {}
}) => {
  if (kind === "tag") {
    return (
      <Tag
        mapZoomFactor={mapZoomFactor}
        id={mac}
        x={x}
        y={y}
        data={data}
        onClick={() => {
          onClick({ kind, data });
        }}
      />
    );
  }
  return null;
};

MapMarker.propTypes = {
  mapZoomFactor: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
  mac: PropTypes.string,
  name: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default MapMarker;
