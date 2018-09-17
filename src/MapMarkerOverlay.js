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

function getImageStyle({ kind, item }) {
  console.log({ kind, item });
  if (kind === "placemark") {
    const url = getPlacemarkIconURL(item.type);
    return {
      backgroundSize: "70%",
      backgroundImage: `url('${url}')`,
      backgroundColor: `#${item.color}`,
      height: 300
    };
  } else if (kind === "tag" && item.editor_data.image_url) {
    return {
      backgroundImage: `url('${item.editor_data.image_url}')`,
      height: 300
    };
  } else {
    return {
      background: theme.brandBrightBlue,
      height: 300
    };
  }
}

const MapMarkerOverlay = ({ kind, item, toggleMapMarkerOverlay }) => (
  <Overlay
    position="left"
    onCloseClicked={() => {
      toggleMapMarkerOverlay({ open: false });
    }}
  >
    <div className={cssOverlayImage} style={getImageStyle({ kind, item })} />
    <div className={cssOverlayContent}>
      <p className={cssOverlayName}>
        {(kind === "tag" ? item.editor_data.name : item.name) || STRINGS.enDash}
      </p>
      {kind === "tag" ? (
        <div className={cssTagData}>
          {item.editor_data.tags ? (
            <LabelList
              align="left"
              labels={item.editor_data.tags.map(x => x.name)}
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
  kind: PropTypes.oneOf(["tag", "placemark"]),
  item: PropTypes.object.isRequired,
  toggleMapMarkerOverlay: PropTypes.func.isRequired
};

export default MapMarkerOverlay;
