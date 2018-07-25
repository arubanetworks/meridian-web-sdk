import { h } from "preact";
import PropTypes from "prop-types";

import { getPlacemarkIconURL } from "./util";
import { css, theme, mixins, cx } from "./style";

const cssOverlay = css({
  label: "overlay",
  ...mixins.shadow,
  ...mixins.rounded,
  overflow: "hidden",
  background: theme.white,
  color: theme.textColor,
  fill: "#000",
  position: "absolute",
  left: 10,
  top: 10,
  right: 10,
  zIndex: 2,
  maxWidth: 400
});

const cssOverlayImage = css({
  label: "overlay-image",
  width: "100%",
  backgroundColor: "white",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover"
});

const cssOverlayContent = css({
  label: "overlay-content",
  padding: 20
});

const cssOverlayName = css({
  label: "overlay-name",
  fontSize: 24
});

const cssClose = css({
  label: "overlay-close",
  ...mixins.buttonReset,
  ...mixins.focusOutline,
  position: "absolute",
  top: 10,
  right: 10,
  padding: 4,
  width: 32,
  height: 32,
  fontSize: 11,
  textAlign: "center",
  background: theme.white,
  color: theme.textColor,
  borderRadius: "100%",
  fontWeight: "bold",
  boxShadow: "0 0 1px rgba(0, 0, 0, 0.8)",
  "&:hover": {
    background: theme.buttonHoverColor,
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.8)"
  }
});

function getImageStyle({ image_url, color, type }) {
  if (type) {
    const customImage = image_url;
    const imageURL = customImage ? customImage : getPlacemarkIconURL(type);
    return {
      backgroundImage: `url('${imageURL}')`,
      backgroundColor: `#${color}`,
      height: "300px"
    };
  }
  return {
    backgroundImage: `url('${image_url}')`,
    height: image_url ? "300px" : "20px"
  };
}

const Overlay = ({ data, closeInfoOverlay }) => (
  <div className={cx(cssOverlay, "meridian-overlay")}>
    <div
      className={cx(cssOverlayImage, "meridian-overlay-marker-image")}
      style={getImageStyle(data)}
    >
      <button
        className={cx(cssClose, "meridian-overlay-close")}
        onClick={closeInfoOverlay}
      >
        <svg viewBox="0 0 36 36">
          <path d="M19.41 18l6.36-6.36a1 1 0 0 0-1.41-1.41L18 16.59l-6.36-6.36a1 1 0 0 0-1.41 1.41L16.59 18l-6.36 6.36a1 1 0 1 0 1.41 1.41L18 19.41l6.36 6.36a1 1 0 0 0 1.41-1.41z" />
        </svg>
      </button>
    </div>
    <div className={cx(cssOverlayContent, "meridian-overlay-content")}>
      <p className={cx(cssOverlayName, "meridian-overlay-marker-name")}>
        {data.name}
      </p>
    </div>
  </div>
);

Overlay.propTypes = {
  data: PropTypes.object,
  closeInfoOverlay: PropTypes.object
};

export default Overlay;
