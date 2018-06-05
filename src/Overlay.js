import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme, mixins } from "./style";

const cssOverlay = css({
  label: "drawer",
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
    position: "absolute",
    top: 10,
    left: 10
  },
  "& .meridian-overlay-content": {
    padding: 20
  }
});

const cssImage = css({
  width: "100%",
  borderRadius: 5,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0
});

const Overlay = ({ kind, data, onClose }) => {
  if (kind && data && Object.keys(data).length > 0) {
    return (
      <div className={cssOverlay}>
        <img className={cssImage} src={data.image_url} />
        <button class="meridian-overlay-close" onClick={onClose}>
          close
        </button>
        <div class="meridian-overlay-content">
          <p style={{ marginTop: 0 }}>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              ({kind}) {data.name}
            </span>
          </p>
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
