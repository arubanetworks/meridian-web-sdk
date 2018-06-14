import { h } from "preact";
import PropTypes from "prop-types";

import { css, cx, mixins } from "./style";

const cssTag = css({
  label: "meridian-tag",
  ...mixins.shadow,
  borderRadius: "100%",
  position: "absolute",
  backgroundColor: "white",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  border: "2px solid white",
  width: 24,
  height: 24,
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

const Tag = ({ x, y, data, onClick = () => {} }) => {
  const imageURL = data.image_url;
  const background = imageURL
    ? { backgroundImage: `url('${imageURL}')` }
    : { backgroundColor: "black" };
  return (
    <div
      aria-role="button"
      tabIndex="0"
      className={cx(cssTag, "meridian-tag")}
      style={{
        left: x,
        top: y,
        ...background
      }}
      onClick={onClick}
    />
  );
};

Tag.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Tag;
