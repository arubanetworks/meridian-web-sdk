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
  width: 400,
  "& .meridian-overlay-close": {
    display: "inline-block",
    margin: 10
  },
  "& .meridian-overlay-content": {
    padding: 20
  },
  "& .meridian-overlay-marker-image": {
    width: "100%",
    height: 300,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  "& .meridian-overlay-marker-name": {
    fontSize: 16
  }
});

const cssClose = css({
  label: "close",
  ...mixins.buttonReset,
  width: 30,
  height: 30,
  background: "rgba(255, 255, 255, 0.5)",
  color: theme.black,
  borderRadius: "100%",
  fontWeight: "bold",
  boxShadow: "0 0 1px rgba(0, 0, 0, 0.8)",
  "&:hover": {
    background: theme.white,
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.8)"
  }
});

const closeCharacter = "✕";

const Overlay = ({ kind, data, onClose }) => {
  if (kind && data && Object.keys(data).length > 0) {
    return (
      <div className={cx(cssOverlay, "meridian-overlay")}>
        <div
          className="meridian-overlay-marker-image"
          style={{ backgroundImage: `url('${data.image_url}')` }}
        >
          <button
            className={cx(cssClose, "meridian-overlay-close")}
            onClick={onClose}
          >
            {closeCharacter}
          </button>
        </div>
        <div className="meridian-overlay-content">
          <div className="meridian-overlay-marker-name">{data.name}</div>
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
