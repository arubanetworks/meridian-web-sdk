import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx, mixins } from "./style";

const SIZE = 24;

const cssTag = css({
  label: "meridian-tag",
  ...mixins.shadow,
  cursor: "pointer",
  borderRadius: "100%",
  position: "absolute",
  backgroundColor: "white",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  border: "2px solid white",
  overflow: "hidden",
  width: SIZE,
  height: SIZE,
  transition: `
    top 500ms ease,
    left 500ms ease
  `,
  "&:focus": {
    zIndex: 1,
    outline: "none",
    boxShadow: "0 0 4px black"
  }
});

// Gotta subtract half the size to line up the center of the circle on the point
const Tag = ({ x, y, data, onClick = () => {} }) => {
  const imageURL = data.image_url;
  if (imageURL) {
    return (
      <div
        aria-role="button"
        tabIndex="0"
        className={cx(cssTag, "meridian-tag")}
        style={{
          left: x - SIZE / 2,
          top: y - SIZE / 2,
          backgroundImage: `url('${imageURL}')`
        }}
        onClick={onClick}
      />
    );
  }
  return (
    <div
      aria-role="button"
      tabIndex="0"
      className={cx(cssTag, "meridian-tag")}
      style={{
        left: x - SIZE / 2,
        top: y - SIZE / 2
      }}
      onClick={onClick}
    >
      <svg viewBox="0 0 36 36" style={{ margin: -8 }}>
        <use href="#meridian-tag-default" />
      </svg>
    </div>
  );
};

Tag.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Tag;
