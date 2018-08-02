import { h } from "preact";
import PropTypes from "prop-types";

import { getPlacemarkIconURL } from "./util";
import { css, cx, mixins, theme } from "./style";

const SIZE = 24;
const SHRINK_POINT = 0.2;
const SHRINK_FACTOR = 1.4;

const cssPlacemark = css({
  label: "meridian-placemark",
  position: "absolute"
});

const cssPlacemarkIcon = css(mixins.buttonReset, mixins.pointer, {
  label: "meridian-placemark-icon",
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
  "&:focus": {
    outline: "none",
    zIndex: 3,
    width: SIZE * 1.25,
    height: SIZE * 1.25
  }
});

const cssLabel = css(mixins.textStrokeWhite, {
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
  fontWeight: "bold"
});

const cssLabelOnly = css({
  label: "meridian-label-only",
  textTransform: "uppercase",
  color: "#666",
  fontSize: 16
});

const getIconStyle = data => {
  const color = "#" + data.color;
  const iconURL = getPlacemarkIconURL(data.type);
  return {
    borderColor: color,
    backgroundColor: color,
    backgroundImage: `url('${iconURL}')`
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
  const shrinkFactor = mapZoomFactor < SHRINK_POINT ? SHRINK_FACTOR : 1;
  const k = 1 / mapZoomFactor / shrinkFactor;
  const style = {
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${k})`
  };
  if (labelOnly) {
    return (
      <div className={cx(cssPlacemark, "meridian-placemark")} style={style}>
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
    <div className={cx(cssPlacemark, "meridian-placemark")} style={style}>
      <button
        disabled={disabled}
        className={cx(cssPlacemarkIcon, "meridian-placemark-icon")}
        onClick={event => {
          event.target.focus();
          onClick(event);
        }}
        style={getIconStyle(data)}
      />
      <div
        className={cx(cssLabel, "meridian-label")}
        style={{
          visibility: mapZoomFactor < SHRINK_POINT ? "hidden" : ""
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
