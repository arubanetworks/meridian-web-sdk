/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import OverlayCircle from "./OverlayCircle";
import OverlayImage from "./OverlayImage";
import OverlayMarker from "./OverlayMarker";
import OverlayPath from "./OverlayPath";
import OverlayPolygon from "./OverlayPolygon";
import OverlayPolyline from "./OverlayPolyline";
import OverlayUse from "./OverlayUse";
import { css } from "./style";
import { CustomOverlay } from "./web-sdk";

interface OverlayLayerProps {
  mapZoomFactor: number;
  overlays: CustomOverlay[];
}

const OverlayLayer: FunctionComponent<OverlayLayerProps> = ({
  mapZoomFactor,
  overlays,
}) => {
  return (
    <svg className={cssOverlay} data-testid="meridian--private--overlay-layer">
      {overlays.map((obj, i) => {
        switch (obj.type) {
          case "polygon":
            return (
              <OverlayPolygon key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          case "polyline":
            return (
              <OverlayPolyline key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          case "path":
            return (
              <OverlayPath key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          case "circle":
            return (
              <OverlayCircle key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          case "image":
            return (
              <OverlayImage key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          case "marker":
            return (
              <OverlayMarker key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          case "use":
            return (
              <OverlayUse key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          default:
            return null;
        }
      })}
    </svg>
  );
};

const cssOverlay = css({
  label: "overlay-layer",
  position: "absolute",
  overflow: "visible",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export default OverlayLayer;
