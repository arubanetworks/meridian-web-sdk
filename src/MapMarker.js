import { h } from "preact";
import PropTypes from "prop-types";

import Tag from "./Tag";

const MapMarker = item => {
  const { id, x, y, data, mapZoomFactor, disabled, onClick = () => {} } = item;
  return (
    <Tag
      mapZoomFactor={mapZoomFactor}
      id={id}
      x={x}
      y={y}
      data={data}
      onClick={() => {
        onClick(item);
      }}
      disabled={disabled}
    />
  );
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
