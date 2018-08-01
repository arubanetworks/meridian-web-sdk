import { h } from "preact";
import PropTypes from "prop-types";

import Overlay from "./Overlay";
import { getPlacemarkIconURL } from "./util";
import { css, theme, cx } from "./style";

const cssOverlayImage = css({
  label: "overlay-image",
  width: "100%",
  backgroundColor: "white",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover"
});

const cssOverlayName = css({
  label: "overlay-name",
  padding: "0 20px",
  fontSize: 24
});

function getImageStyle({ image_url, color, type }) {
  if (type) {
    const url = image_url || getPlacemarkIconURL(type);
    return {
      backgroundSize: "70%",
      backgroundImage: `url('${url}')`,
      backgroundColor: `#${color}`,
      height: 300
    };
  } else if (image_url) {
    return {
      backgroundImage: `url('${image_url}')`,
      height: 300
    };
  } else {
    return {
      background: theme.brandBrightBlue,
      height: 300
    };
  }
}

const InfoOverlay = ({ data, closeInfoOverlay }) => (
  <Overlay position="left" onCloseClicked={closeInfoOverlay}>
    <div
      className={cx(cssOverlayImage, "meridian-overlay-marker-image")}
      style={getImageStyle(data)}
    />
    <p className={cx(cssOverlayName, "meridian-overlay-marker-name")}>
      {data.name || "–"}
    </p>
  </Overlay>
);

InfoOverlay.propTypes = {
  data: PropTypes.object,
  closeInfoOverlay: PropTypes.object
};

export default InfoOverlay;
