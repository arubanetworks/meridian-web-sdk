import { h } from "preact";
import PropTypes from "prop-types";

import Tag from "./Tag";
import Placemark from "./Placemark";

const MapMarker = ({
  selectedItem,
  kind,
  id,
  x,
  y,
  data,
  mapZoomFactor,
  disabled,
  onClick = () => {}
}) => {
  const childProps = {
    isSelected: selectedItem ? selectedItem.id === id : false,
    mapZoomFactor,
    id,
    x,
    y,
    data,
    disabled,
    onClick: () => {
      onClick(data);
    }
  };
  if (kind === "tag") {
    return <Tag {...childProps} labels={data.labels} />;
  } else if (kind === "placemark") {
    return <Placemark {...childProps} />;
  }
  return null;
};

MapMarker.propTypes = {
  selectedItem: PropTypes.object.isRequired,
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
