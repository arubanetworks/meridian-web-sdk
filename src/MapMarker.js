import { h } from "preact";
import PropTypes from "prop-types";

import Tag from "./Tag";
import Placemark from "./Placemark";

const MapMarker = item => {
  const {
    selectedItem,
    kind,
    id,
    x,
    y,
    data,
    mapZoomFactor,
    disabled,
    onClick = () => {}
  } = item;
  const props = {
    isSelected: selectedItem ? selectedItem.id === id : false,
    mapZoomFactor,
    id,
    x,
    y,
    data,
    disabled,
    onClick: () => {
      onClick(item);
    }
  };
  if (kind === "tag") {
    return <Tag {...props} />;
  } else if (kind === "placemark") {
    return <Placemark {...props} />;
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
