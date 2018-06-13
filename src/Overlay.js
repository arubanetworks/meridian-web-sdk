import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme, mixins, cx } from "./style";

const cssOverlay = css({
  label: "overlay",
  ...mixins.shadow,
  ...mixins.rounded,
  overflow: "hidden",
  background: theme.white,
  color: "#000",
  position: "absolute",
  left: 10,
  top: 10,
  zIndex: 2,
  width: 400
});

const cssOverlayImage = css({
  width: "100%",
  backgroundColor: "white",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover"
});

const cssOverlayContent = css({
  padding: 20
});

const cssOverlayName = css({
  fontSize: 16
});

const cssClose = css({
  label: "close",
  ...mixins.buttonReset,
  width: 26,
  height: 26,
  fontSize: 11,
  textAlign: "center",
  margin: 10,
  background: "rgba(255, 255, 255, 0.5)",
  color: theme.black,
  borderRadius: "100%",
  fontWeight: "bold",
  boxShadow: "0 0 1px rgba(0, 0, 0, 0.8)",
  "&:focus": { outline: "none" },
  "&:hover": {
    background: theme.white,
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.8)"
  }
});

const closeCharacter = "╳";

const Overlay = ({ kind, data, onClose }) => {
  if (kind && data && Object.keys(data).length > 0) {
    return (
      <div className={cx(cssOverlay, "meridian-overlay")}>
        <div
          className={cx(cssOverlayImage, "meridian-overlay-marker-image")}
          style={{
            backgroundImage: `url('${data.image_url}')`,
            height: data.image_url ? "300px" : "20px"
          }}
        >
          <button
            className={cx(cssClose, "meridian-overlay-close")}
            onClick={onClose}
          >
            {closeCharacter}
          </button>
        </div>
        <div className={cx(cssOverlayContent, "meridian-overlay-content")}>
          <p className={cx(cssOverlayName, "meridian-overlay-marker-name")}>
            {data.name}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

Overlay.propTypes = {
  data: PropTypes.object,
  kind: PropTypes.string,
  onClose: PropTypes.object
};

export default Overlay;
