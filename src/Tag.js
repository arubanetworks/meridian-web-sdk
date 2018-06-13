import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx } from "./style";

const cssCircleClip = css({
  label: "meridian-svg-circle-clip",
  clipPath: "circle()"
});

const cssTransitionXY = css({
  label: "meridian-transition-xy",
  transition: `
    cx 500ms ease,
    cy 500ms ease,
    x 500ms ease,
    y 500ms ease
  `
});

const Tag = ({ x, y, data, onClick = () => {} }) => {
  const imageUrl = data.image_url;
  if (imageUrl) {
    return (
      <g cursor="pointer">
        <circle
          className={cssTransitionXY}
          r="14"
          cx={x + 14}
          cy={y + 14}
          fill="rgba(0, 0, 0, 0.2)"
        />
        <circle
          className={cssTransitionXY}
          r="13"
          cx={x + 14}
          cy={y + 14}
          fill="white"
        />
        <image
          className={cx(cssCircleClip, cssTransitionXY, "meridian-tag")}
          width="24"
          height="24"
          x={x + 2}
          y={y + 2}
          preserveAspectRatio="xMidYMid slice"
          pointerEvents="all"
          xlinkHref={imageUrl}
          onClick={onClick}
        />
      </g>
    );
  }
  return (
    <g cursor="pointer">
      <circle
        className={cssTransitionXY}
        r="14"
        cx={x + 12}
        cy={y + 12}
        fill="rgba(0, 0, 0, 0.2)"
      />
      <circle
        className={cssTransitionXY}
        r="13"
        cx={x + 12}
        cy={y + 12}
        fill="white"
        onClick={onClick}
      />
      <use
        className={cssTransitionXY}
        x={x - 6}
        y={y - 6}
        href="#meridian-tag-default"
      />
    </g>
  );
};

Tag.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Tag;
