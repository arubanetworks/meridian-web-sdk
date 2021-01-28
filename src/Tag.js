/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import PropTypes from "prop-types";
import defaultTagImageURL from "../files/tags/generic.svg";
import { css, cx, mixins } from "./style";
import { getTagLabels } from "./util";

const SIZE = 48;
const SHRINK_POINT = 0.2;
const SHRINK_FACTOR = 1.4;

const cssTag = css(
  mixins.shadow,
  mixins.buttonReset,
  mixins.pointer,
  mixins.focusNone,
  {
    label: "tag",
    width: SIZE,
    height: SIZE,
    borderRadius: "100%",
    position: "absolute",
    backgroundImage: "var(--meridian-tag-imageURL)",
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
  width: SIZE * 1.25,
  height: SIZE * 1.25,
  zIndex: 3,
  boxShadow: "0 0 0 2px white, 0 0 4px black"
});

const Tag = ({
  isSelected,
  data,
  mapZoomFactor,
  onClick = () => {},
  disabled = false
}) => {
  const shrinkFactor = mapZoomFactor < SHRINK_POINT ? SHRINK_FACTOR : 1;
  const k = 1 / mapZoomFactor / shrinkFactor;
  const labelClassNames = getTagLabels(data).map(label => {
    const s = label.replace(/ /g, "-").replace(/[^a-z0-9_-]/i, "");
    return `meridian-tag-label-${s}`;
  });
  const className = isSelected
    ? cx(
        "meridian-tag-selected",
        "meridian-tag",
        labelClassNames,
        cssTagSelected,
        cssTag
      )
    : cx("meridian-tag", labelClassNames, cssTag);

  function getTagStyle(data) {
    const url = data.image_url || defaultTagImageURL;
    return {
      left: data.x,
      top: data.y,
      transform: `translate(-50%, -50%) scale(${k})`,
      "--meridian-tag-imageURL": `url('${url}')`
    };
  }
  return (
    <button
      disabled={disabled}
      className={className}
      style={getTagStyle(data)}
      data-meridian-tag-id={data.id}
      onClick={event => {
        event.target.focus();
        onClick();
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
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Tag;
