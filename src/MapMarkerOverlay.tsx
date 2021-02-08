/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import LabelList from "./LabelList";
import Overlay from "./Overlay";
import { css, theme } from "./style";
import { getTagLabels, STRINGS } from "./util";
import { placemarkIconURL } from "./web-sdk";

interface MapMarkerOverlayProps {
  kind: "tag" | "placemark";
  item: Record<string, any>;
  toggleMapMarkerOverlay: (states: Record<string, boolean>) => void;
}

const MapMarkerOverlay: FunctionComponent<MapMarkerOverlayProps> = ({
  kind,
  item,
  toggleMapMarkerOverlay
}) => {
  const imageStyle: Record<string, any> = (() => {
    if (kind === "placemark") {
      const url = placemarkIconURL(item.type);
      return {
        backgroundSize: "70%",
        backgroundImage: `url('${url}')`,
        backgroundColor: `#${item.color}`,
        height: 300
      };
    }
    if (kind === "tag" && item.image_url) {
      return {
        backgroundImage: `url('${item.image_url}')`,
        height: 300
      };
    }
    return {
      background: theme.brandBrightBlue,
      height: 300
    };
  })();
  return (
    <Overlay
      position="left"
      onCloseClicked={() => {
        toggleMapMarkerOverlay({ open: false });
      }}
    >
      <div className={cssOverlayImage} style={imageStyle} />
      <div className={cssOverlayContent}>
        <p className={cssOverlayName}>{item.name || STRINGS.enDash}</p>
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

export default MapMarkerOverlay;
