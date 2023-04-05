/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import LabelList from "./LabelList";
import MapComponent from "./MapComponent";
import Overlay from "./Overlay";
import { css, theme, cx } from "./style";
import { getTagLabels } from "./util";
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
  function placemarkDescription() {
    if (kind === "placemark" && item.description) {
      return { __html: item.description };
    }
    return undefined;
  }
  const imageStyle: Record<string, any> = (() => {
    if (kind === "placemark" && item.image_url) {
      return {
        backgroundImage: `url('${item.image_url}')`,
        backgroundSize: "contain",
        height: 300,
        minHeight: 220,
      };
    }
    if (kind === "placemark") {
      const url = placemarkIconURL(item.type);
      return {
        backgroundSize: "contain",
        backgroundImage: `url('${url}')`,
        backgroundColor: `#${item.color}`,
        height: 300,
        minHeight: 220,
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
      <div className={cx("meridian-overlay-content", cssOverlayContent)}>
        <p className={cx("meridian-overlay-item-name", cssOverlayName)}>
          {item.name || item.type_name}
        </p>
        {kind === "tag" ? (
          <div className={cx("meridian-overlay-tag-data", cssTagData)}>
            <LabelList
              align="left"
              labels={getTagLabels(item as TagData)}
              fontSize={theme.fontSize}
            />
            <p>MAC: {item.mac}</p>
          </div>
        ) : (
          <div
            className={cx(
              "meridian-overlay-placemark-description",
              cssPlacemarkDescription
            )}
            // Content is sanitized on the BE upon submission
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={placemarkDescription()}
          />
        )}
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
  fontSize: 22,
});

const cssOverlayContent = css({
  label: "overlay-content",
  padding: "0 20px 15px 20px",
  overflow: "auto",
});

const cssTagData = css({
  label: "overlay-tag-data",
  fontSize: 14,
});

const cssPlacemarkDescription = css({
  label: "overlay-placemark-data",
  fontSize: 14,
});

export default DetailsOverlay;
