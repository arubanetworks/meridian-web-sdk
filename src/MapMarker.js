import { h } from "preact";
import PropTypes from "prop-types";
import Tag from "./Tag";

const MapMarker = ({ kind, mac, x, y, data, onMarkerClick = () => {} }) => {
  if (kind === "tag") {
    return (
      <Tag
        id={mac}
        x={x}
        y={y}
        data={data}
        onClick={() => {
          onMarkerClick(data);
        }}
      />
    );
  }
  return null;
};

MapMarker.PropTypes = {
  kind: PropTypes.string.isRequired,
  mac: PropTypes.string,
  name: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onMarkerClick: PropTypes.func
};

export default MapMarker;
