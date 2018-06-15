import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx, mixins } from "./style";

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

const Tag = ({ x, y, data, mapZoomFactor, onClick = () => {} }) => {
  const size = 32;
  const k = 1 / mapZoomFactor;
  const imageURL = data.image_url;
  const className = cx(cssTag, "meridian-tag");
  const style = {
    width: size,
    height: size,
    left: x,
    top: y,
    transform: `translate(-50%, -50%) scale(${k})`
  };
  if (imageURL) {
    const backgroundImage = `url('${imageURL}')`;
    return (
      <div
        aria-role="button"
        tabIndex="0"
        className={className}
        onClick={onClick}
        style={{ ...style, backgroundImage }}
      />
    );
  }
  return (
    <div
      aria-role="button"
      tabIndex="0"
      className={className}
      onClick={onClick}
      style={style}
    >
      <svg viewBox="0 0 36 36" style={{ margin: -8 }}>
        <use href="#meridian-tag-default" />
      </svg>
    </div>
  );
};

Tag.propTypes = {
  mapZoomFactor: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Tag;
