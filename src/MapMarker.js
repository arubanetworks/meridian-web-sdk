import { h } from "preact";
import PropTypes from "prop-types";

import Tag from "./Tag";
import Placemark from "./Placemark";

const MapMarker = ({
  selectedItem,
  kind,
  data,
  mapZoomFactor,
  disabled,
  onClick = () => {}
}) => {
  if (kind === "tag") {
    return (
      <Tag
        isSelected={selectedItem ? selectedItem.mac === data.mac : false}
        mapZoomFactor={mapZoomFactor}
        data={data}
        onClick={() => {
          onClick(data);
        }}
        disabled={disabled}
      />
    );
  } else if (kind === "placemark") {
    return (
      <Placemark
        isSelected={selectedItem ? selectedItem.id === data.id : false}
        mapZoomFactor={mapZoomFactor}
        data={data}
        onClick={() => {
          onClick(data);
        }}
        disabled={disabled}
      />
    );
  }
  return null;
};

MapMarker.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  mapZoomFactor: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default MapMarker;
