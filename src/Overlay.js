import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme } from "./style";

const cssOverlay = css({
  label: "overlay",
  border: `1px solid ${theme.borderColor}`,
  borderRadius: 5,
  background: "#fafafa",
  color: "#000",
  position: "absolute",
  left: 13,
  top: 13,
  zIndex: 2,
  width: 400,
  "& button.meridian-overlay-close": {
    display: "inline-block",
    margin: 10
  },
  "& .meridian-overlay-content": {
    padding: 20
  },
  "& .meridian-overlay-marker-image": {
    width: 400,
    height: 300,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderRadius: 5,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  "& .meridian-overlay-marker-name": {
    fontSize: 16
  }
});

const Overlay = ({ kind, data, onClose }) => {
  if (kind && data && Object.keys(data).length > 0) {
    return (
      <div className={`${cssOverlay} meridian-overlay`}>
        <div
          className="meridian-overlay-marker-image"
          style={{ backgroundImage: `url('${data.image_url}')` }}
        >
          <button className="meridian-overlay-close" onClick={onClose}>
            x
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

Overlay.PropTypes = {
  data: PropTypes.object,
  kind: PropTypes.string,
  onClose: PropTypes.object
};

export default Overlay;
