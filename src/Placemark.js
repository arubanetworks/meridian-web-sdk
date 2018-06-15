import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx, mixins } from "./style";

const cssPlacemark = css({
  label: "meridian-placemark",
  ...mixins.shadow,
  ...mixins.buttonReset,
  cursor: "pointer",
  borderRadius: "100%",
  position: "absolute",
  backgroundColor: "white",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  border: "2px solid white",
  overflow: "hidden",
  transition: `
    top 500ms ease,
    left 500ms ease
  `,
  zIndex: 1,
  "&:focus": {
    zIndex: 3,
    outline: "none",
    boxShadow: "0 0 4px black"
  }
});

const getIconName = ({ type }) => {
  if (type) {
    return "placemark-" + type.replace(/_/g, "-");
  }
  return "placemark";
};

// TODO: Show the name for label placemarks instead of an icon
const Placemark = ({ x, y, data, mapZoomFactor, onClick = () => {} }) => {
  const size = 24;
  const k = 1 / mapZoomFactor;
  const className = cx(cssPlacemark, "meridian-placemark");
  const iconName = getIconName(data);
  // TODO: Maybe not our final location?
  const prefix =
    "https://storage.googleapis.com/meridian-web-sdk-assets/placemarks/";
  const style = {
    width: size,
    height: size,
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${k})`,
    backgroundImage: `url('${prefix}${iconName}.svg')`
  };
  return <button className={className} onClick={onClick} style={style} />;
};

Placemark.propTypes = {
  mapZoomFactor: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Placemark;
