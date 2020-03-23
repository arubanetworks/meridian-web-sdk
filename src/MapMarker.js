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
  onClick = () => {},
  youAreHerePlacemarkID
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
        youAreHerePlacemarkID={youAreHerePlacemarkID}
      />
    );
  }
  return null;
};

MapMarker.propTypes = {
  selectedItem: PropTypes.object,
  mapZoomFactor: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  youAreHerePlacemarkID: PropTypes.string
};

export default MapMarker;
