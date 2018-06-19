import { h } from "preact";
import PropTypes from "prop-types";

import Tag from "./Tag";
import Placemark from "./Placemark";

const MapMarker = ({
  kind,
  id,
  x,
  y,
  data,
  mapZoomFactor,
  onClick = () => {},
  disabled
}) => {
  if (kind === "tag") {
    return (
      <Tag
        mapZoomFactor={mapZoomFactor}
        id={id}
        x={x}
        y={y}
        data={data}
        onClick={() => {
          onClick({ kind, data });
        }}
        disabled={disabled}
      />
    );
  } else if (kind === "placemark") {
    return (
      <Placemark
        mapZoomFactor={mapZoomFactor}
        id={id}
        x={x}
        y={y}
        data={data}
        onClick={() => {
          onClick({ kind, data });
        }}
        disabled={disabled}
      />
    );
  }
  return null;
};

MapMarker.propTypes = {
  mapZoomFactor: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default MapMarker;
