import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx, mixins, theme } from "./style";

const cssPlacemark = css({
  label: "meridian-placemark",
  ...mixins.shadow,
  ...mixins.buttonReset,
  cursor: "pointer",
  borderRadius: "100%",
  backgroundColor: theme.brandBlue,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  border: "2px solid transparent",
  overflow: "hidden",
  zIndex: 1,
  "&:focus": {
    zIndex: 3,
    outline: "none",
    boxShadow: "0 0 4px black"
  }
});

const cssLabel = css({
  width: 80,
  transform: "translate(-35%, 0)",
  textAlign: "center",
  padding: "2px 4px",
  borderRadius: 4,
  color: "black",
  textShadow: "0 0 8px white"
});

// TODO: Maybe not our final location?
const assetPrefix =
  "https://storage.googleapis.com/meridian-web-sdk-assets/placemarks";

const getIconStyle = ({ type }) => {
  if (!type || type === "label_department") {
    return {};
  }
  const name = "placemark-" + type.replace(/_/g, "-");
  return { backgroundImage: `url('${assetPrefix}/${name}.svg')` };
};

// TODO: Show the name for label placemarks instead of an icon
const Placemark = ({ x, y, data, mapZoomFactor, onClick = () => {} }) => {
  const size = 24;
  const k = 1 / mapZoomFactor;
  const className = cx(cssPlacemark, "meridian-placemark");
  const style = {
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${k})`,
    position: "absolute"
  };
  return (
    <div style={style}>
      <button
        className={className}
        onClick={onClick}
        style={{
          ...getIconStyle(data),
          width: size,
          height: size
        }}
      />
      <div className={cx(cssLabel, "meridian-label")}>{data.name}</div>
    </div>
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
