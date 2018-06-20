import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx, mixins, theme } from "./style";

const SIZE = 22;

const cssPlacemark = css({
  label: "meridian-placemark",
  ...mixins.buttonReset,
  ...mixins.pointer,
  transition: "width 80ms ease, height 80ms ease",
  display: "block",
  width: SIZE,
  height: SIZE,
  borderRadius: "100%",
  backgroundColor: theme.brandBlue,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  border: "2px solid transparent",
  overflow: "hidden",
  zIndex: 1,
  boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.5)",
  "&:focus": {
    zIndex: 3,
    width: SIZE * 1.25,
    height: SIZE * 1.25,
    outline: "none"
  }
});

const cssLabel = css({
  label: "meridian-label",
  marginLeft: "50%",
  position: "absolute",
  minWidth: 55,
  maxWidth: 120,
  fontSize: 14,
  textAlign: "center",
  paddingTop: 4,
  color: "black",
  userSelect: "none",
  transform: "translate(-50%, 0)",
  textShadow: `
    0 1px 0 rgba(255, 255, 255, 0.5),
    -1px 0 0 rgba(255, 255, 255, 0.5),
    1px 0 0 rgba(255, 255, 255, 0.5),
    0 -1px 0 rgba(255, 255, 255, 0.5)
  `
});

const cssLabelOnly = css({
  label: "meridian-label-only",
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

const Placemark = ({
  x,
  y,
  data,
  mapZoomFactor,
  onClick = () => {},
  disabled = false
}) => {
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
        disabled={disabled}
        className={cx(cssPlacemark, "meridian-placemark")}
        onClick={onClick}
        style={getIconStyle(data)}
      />
      <div
        className={cx(cssLabel, "meridian-label")}
        style={{
          visibility: mapZoomFactor < 1 ? "hidden" : ""
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
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Placemark;
