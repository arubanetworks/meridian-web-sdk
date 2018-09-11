import { h } from "preact";
import PropTypes from "prop-types";

import { getAssetURL } from "./util";
import { css, cx, mixins } from "./style";

const SIZE = 48;
const SHRINK_POINT = 0.2;
const SHRINK_FACTOR = 1.4;
const DEFAULT_TAG_IMAGE = getAssetURL("tags/tag.svg");

window.css = css;

const cssTag = css(
  mixins.shadow,
  mixins.buttonReset,
  mixins.pointer,
  mixins.focusNone,
  {
    label: "meridian-tag",
    width: SIZE,
    height: SIZE,
    borderRadius: "100%",
    position: "absolute",
    backgroundColor: "white",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    border: "2px solid white",
    overflow: "hidden",
    transition: `
      width 80ms ease,
      height 80ms ease,
      top 500ms ease,
      left 500ms ease
    `,
    zIndex: 2
  }
);

const cssTagSelected = css(cssTag, {
  outline: "none",
  width: SIZE * 1.25,
  height: SIZE * 1.25,
  zIndex: 3,
  boxShadow: "0 0 4px black"
});

const Tag = ({
  isSelected,
  x,
  y,
  data,
  mapZoomFactor,
  onClick = () => {},
  disabled = false
}) => {
  const shrinkFactor = mapZoomFactor < SHRINK_POINT ? SHRINK_FACTOR : 1;
  const k = 1 / mapZoomFactor / shrinkFactor;
  const imageURL = data.image_url || DEFAULT_TAG_IMAGE;
  const className = isSelected
    ? cx(cssTagSelected, "meridian-tag-selected")
    : cx(cssTag, "meridian-tag");
  const style = {
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${k})`,
    backgroundImage: `url('${imageURL}')`
  };
  return (
    <button
      disabled={disabled}
      className={className}
      style={style}
      onClick={event => {
        event.target.focus();
        onClick(event);
      }}
      onMouseDown={event => {
        event.stopPropagation();
      }}
    />
  );
};

Tag.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  mapZoomFactor: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Tag;
