import { h } from "preact";
import PropTypes from "prop-types";
import { css } from "./style";

const cssTag = css({
  label: "meridian-tag",
  clipPath: "circle()",
  transition: "x 500ms ease, y 500ms ease"
});

const Tag = ({ x, y, id, data, onClick = () => {} }) => {
  const imageUrl = data.image_url;
  if (imageUrl) {
    return (
      <image
        width="23"
        height="23"
        x={x}
        y={y}
        preserveAspectRatio="xMidYMid slice"
        cursor="pointer"
        pointerEvents="all"
        xlinkHref={imageUrl}
        onClick={onClick}
        className={`${cssTag} meridian-tag`}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 36 36"
      key={id}
      cursor="pointer"
      pointerEvents="all"
      fill="black"
      width="36"
      height="36"
      x={x}
      y={y}
      onClick={onClick}
      className={`${cssTag} meridian-tag`}
    >
      <path
        d="M18.09,7c-0.01,0-0.01,0-0.02,0c0,0-0.01,0-0.01,0C18.04,7,18.02,7,18,7C11.93,7,7,11.93,7,18s4.93,11,11,11
c6.06,0,11-4.93,11-11C29,11.97,24.11,7.05,18.09,7z M15.09,18c0,1.64,1.33,2.98,2.98,2.98c1.64,0,2.98-1.33,2.98-2.98
c0-1.29-0.83-2.38-1.97-2.79v-2.08c2.22,0.51,3.89,2.49,3.89,4.87c0,2.76-2.24,5-5,5c-2.76,0-5-2.24-5-5
c0-2.45,1.78-4.49,4.11-4.91v2.12C15.92,15.62,15.09,16.71,15.09,18z M18,27c-4.96,0-9-4.04-9-9c0-4.65,3.54-8.48,8.07-8.95v2.01
c-3.44,0.44-6.11,3.38-6.11,6.94c0,3.86,3.14,7,7,7c3.86,0,7-3.14,7-7c0-3.48-2.56-6.37-5.89-6.9V9.07C23.53,9.6,27,13.4,27,18
C27,22.96,22.96,27,18,27z"
      />
      <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
    </svg>
  );
};

Tag.PropTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Tag;
