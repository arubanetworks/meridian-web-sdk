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

const Placemark = ({ x, y, data, mapZoomFactor, onClick = () => {} }) => {
  const size = 24;
  const k = 1 / mapZoomFactor;
  // const imageURL = data.image_url;
  const className = cx(cssPlacemark, "meridian-placemark");
  const style = {
    width: size,
    height: size,
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${k})`
  };
  return (
    <button className={className} onClick={onClick} style={style}>
      <span style={{ fontSize: 8 }}>{data.id}</span>
    </button>
  );
};

Placemark.propTypes = {
  mapZoomFactor: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Placemark;
