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
  fontSize: 24
});

const cssOverlayContent = css({
  label: "overlay-content",
  padding: "0 20px 10px 20px"
});

const cssTagData = css({
  fontSize: 14
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

function renderTagData(data) {
  let labels = null;
  if (data.tags.length) {
    labels = data.tags.map(tag => tag.name).join(", ");
  }
  return (
    <div className={cx(cssTagData, "meridian-overlay-marker-tagdata")}>
      {labels ? <p>Labels: {labels}</p> : ""}
      <p>MAC/ID: {data.id}</p>
    </div>
  );
}

const MapMarkerOverlay = ({ data, kind, closeMapMarkerOverlay }) => {
  return (
    <Overlay position="left" onCloseClicked={closeMapMarkerOverlay}>
      <div
        className={cx(cssOverlayImage, "meridian-overlay-marker-image")}
        style={getImageStyle(data)}
      />
      <div className={cx(cssOverlayContent, "meridian-overlay-marker-content")}>
        <p className={cx(cssOverlayName, "meridian-overlay-marker-name")}>
          {data.name || "–"}
        </p>
        {kind === "tag" ? renderTagData(data) : ""}
      </div>
    </Overlay>
  );
};

MapMarkerOverlay.propTypes = {
  data: PropTypes.object,
  kind: PropTypes.oneOf(["placemark", "tag"]),
  closeMapMarkerOverlay: PropTypes.func
};

export default MapMarkerOverlay;
