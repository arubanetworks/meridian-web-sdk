/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import PropTypes from "prop-types";
import LabelList from "./LabelList";
import Overlay from "./Overlay";
import { css, theme } from "./style";
import { getTagLabels, STRINGS } from "./util";
import { placemarkIconURL } from "./web-sdk";

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

function getImageStyle({ kind, item }) {
  if (kind === "placemark") {
    const url = placemarkIconURL(item.type);
    return {
      backgroundSize: "70%",
      backgroundImage: `url('${url}')`,
      backgroundColor: `#${item.color}`,
      height: 300
    };
  } else if (kind === "tag" && item.image_url) {
    return {
      backgroundImage: `url('${item.image_url}')`,
      height: 300
    };
  } else {
    return {
      background: theme.brandBrightBlue,
      height: 300
    };
  }
}

const MapMarkerOverlay = ({ kind, item, toggleMapMarkerOverlay }) => {
  return (
    <Overlay
      position="left"
      onCloseClicked={() => {
        toggleMapMarkerOverlay({ open: false });
      }}
    >
      <div className={cssOverlayImage} style={getImageStyle({ kind, item })} />
      <div className={cssOverlayContent}>
        <p className={cssOverlayName}>
          {(kind === "tag" ? item.name : item.name) || STRINGS.enDash}
        </p>
        {kind === "tag" ? (
          <div className={cssTagData}>
            <LabelList
              align="left"
              labels={getTagLabels(item)}
              fontSize={theme.fontSize}
            />
            <p>MAC: {item.mac}</p>
          </div>
        ) : null}
      </div>
    </Overlay>
  );
};

MapMarkerOverlay.propTypes = {
  kind: PropTypes.oneOf(["tag", "placemark"]),
  item: PropTypes.object.isRequired,
  toggleMapMarkerOverlay: PropTypes.func.isRequired
};

export default MapMarkerOverlay;
