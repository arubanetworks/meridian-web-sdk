import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx, mixins, theme } from "./style";

const SIZE = 24;

const cssPlacemark = css({
  label: "meridian-placemark",
  ...mixins.shadow,
  ...mixins.buttonReset,
  width: SIZE,
  height: SIZE,
  cursor: "pointer",
  borderRadius: "100%",
  backgroundColor: theme.brandBlue,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  border: `2px solid transparent`,
  overflow: "hidden",
  zIndex: 1,
  "&:focus": {
    zIndex: 3,
    outline: "none",
    boxShadow: "0 0 4px black"
  }
});

const cssLabel = css({
  width: 120,
  fontSize: 14,
  textAlign: "center",
  padding: 2,
  borderRadius: 4,
  color: "black",
  userSelect: "none",
  textShadow: `
    0 1px 1px white,
    -1px 0 1px white,
    1px 0 1px white,
    0 -1px 1px white
  `
});

const cssLabelOnly = css({
  textTransform: "uppercase",
  color: "#666",
  fontSize: 16
});

const assetPrefix =
  "https://storage.googleapis.com/meridian-web-sdk-assets/0.0.1/placemarks";

const getIconStyle = data => {
  const name = "placemark-" + data.type.replace(/_/g, "-");
  const color = "#" + data.color;
  return {
    borderColor: color,
    backgroundColor: color,
    backgroundImage: `url('${assetPrefix}/${name}.svg')`
  };
};

const Placemark = ({ x, y, data, mapZoomFactor, onClick = () => {} }) => {
  // Placemarks with a type that starts with label_ are special
  // No icon, grey uppercase text
  const labelOnly = !data.type || data.type.indexOf("label_") === 0;
  const k = 1 / mapZoomFactor;
  const style = {
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${k})`,
    position: "absolute",
    textAlign: "center"
  };
  if (labelOnly) {
    return (
      <div style={style}>
        <div
          className={cx(
            cssLabel,
            cssLabelOnly,
            "meridian-label",
            "meridian-label-only"
          )}
        >
          {data.name}
        </div>
      </div>
    );
  }
  return (
    <div style={style}>
      <button
        className={cx(cssPlacemark, "meridian-placemark")}
        onClick={onClick}
        style={getIconStyle(data)}
      />
      <div
        className={cx(cssLabel, "meridian-label")}
        style={{
          display: mapZoomFactor < 1 ? "none" : ""
        }}
      >
        {data.name}
      </div>
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
