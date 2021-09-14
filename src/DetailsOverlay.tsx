/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import LabelList from "./LabelList";
import MapComponent from "./MapComponent";
import Overlay from "./Overlay";
import { css, theme } from "./style";
import { getTagLabels, uiText } from "./util";
import { PlacemarkData, placemarkIconURL, TagData } from "./web-sdk";

interface DetailsOverlayProps {
  kind: "tag" | "placemark";
  item: TagData | PlacemarkData;
  toggleDetailsOverlay: MapComponent["toggleDetailsOverlay"];
}

const DetailsOverlay: FunctionComponent<DetailsOverlayProps> = ({
  kind,
  item,
  toggleDetailsOverlay,
}) => {
  const imageStyle: Record<string, any> = (() => {
    if (kind === "placemark") {
      const url = placemarkIconURL(item.type);
      return {
        backgroundSize: "70%",
        backgroundImage: `url('${url}')`,
        backgroundColor: `#${item.color}`,
        height: 300,
      };
    }
    if (kind === "tag" && item.image_url) {
      return {
        backgroundImage: `url('${item.image_url}')`,
        height: 300,
      };
    }
    return {
      background: theme.brandBrightBlue,
      height: 300,
    };
  })();
  return (
    <Overlay
      position="left"
      onCloseClicked={() => {
        toggleDetailsOverlay({ open: false });
      }}
    >
      <div className={cssOverlayImage} style={imageStyle} />
      <div className={cssOverlayContent}>
        <p className={cssOverlayName}>{item.name || uiText.enDash}</p>
        {kind === "tag" ? (
          <div className={cssTagData}>
            <LabelList
              align="left"
              labels={getTagLabels(item as TagData)}
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
  backgroundSize: "cover",
});

const cssOverlayName = css({
  label: "overlay-name",
  fontSize: 24,
});

const cssOverlayContent = css({
  label: "overlay-content",
  padding: "0 20px 10px 20px",
});

const cssTagData = css({
  fontSize: 14,
});

export default DetailsOverlay;
