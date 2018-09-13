import { h } from "preact";
import PropTypes from "prop-types";

import Overlay from "./Overlay";
import { getPlacemarkIconURL, STRINGS } from "./util";
import { css, theme } from "./style";
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

function getImageStyle(item) {
  if (item.kind === "placemark") {
    const url = getPlacemarkIconURL(item.type);
    return {
      backgroundSize: "70%",
      backgroundImage: `url('${url}')`,
      backgroundColor: `#${item.color}`,
      height: 300
    };
  } else if (item.kind === "tag" && item.imageURL) {
    return {
      backgroundImage: `url('${item.imageURL}')`,
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
    <div className={cssOverlayImage} style={getImageStyle(item)} />
    <div className={cssOverlayContent}>
      <p className={cssOverlayName}>{item.name || STRINGS.enDash}</p>
      {item.kind === "tag" ? (
        <div className={cssTagData}>
          {item.labels ? (
            <LabelList
              align="left"
              labels={item.labels}
              fontSize={theme.fontSize}
            />
          ) : null}
          <p>MAC: {item.mac}</p>
        </div>
      ) : null}
    </div>
  </Overlay>
);

MapMarkerOverlay.propTypes = {
  item: PropTypes.object.isRequired,
  toggleMapMarkerOverlay: PropTypes.func.isRequired
};

export default MapMarkerOverlay;
