import { h } from "preact";
import PropTypes from "prop-types";

import Overlay from "./Overlay";
import { getPlacemarkIconURL, STRINGS } from "./util";
import { css, theme, cx } from "./style";
import LabelList from "./LabelList";

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

const MapMarkerOverlay = ({ item, toggleMapMarkerOverlay }) => (
  <Overlay
    position="left"
    onCloseClicked={() => {
      toggleMapMarkerOverlay({ open: false });
    }}
  >
    <div
      className={cx(cssOverlayImage, "meridian-overlay-marker-image")}
      style={getImageStyle(item)}
    />
    <div className={cx(cssOverlayContent, "meridian-overlay-marker-conte nt")}>
      <p className={cx(cssOverlayName, "meridian-overlay-marker-name")}>
        {item.name || STRINGS.enDash}
      </p>
      {item.kind === "tag" ? (
        <div className={cx(cssTagData, "meridian-overlay-marker-tagdata")}>
          {item.labels ? <LabelList align="left" labels={item.labels} /> : null}
          <p>MAC/ID: {item.mac || item.id}</p>
        </div>
      ) : null}
    </div>
  </Overlay>
);

MapMarkerOverlay.propTypes = {
  item: PropTypes.object,
  toggleMapMarkerOverlay: PropTypes.func
};

export default MapMarkerOverlay;