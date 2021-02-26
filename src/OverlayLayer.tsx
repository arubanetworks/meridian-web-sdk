/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import OverlayPolygon from "./OverlayPolygon";
import OverlayPolyline from "./OverlayPolyline";
import { css } from "./style";
import { CustomOverlay } from "./web-sdk";

interface OverlayLayerProps {
  mapZoomFactor: number;
  overlays: CustomOverlay[];
}

const OverlayLayer: FunctionComponent<OverlayLayerProps> = ({
  mapZoomFactor,
  overlays
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
          default:
            return null;
        }
      })}
    </svg>
  );
};

const cssOverlay = css({
  label: "overlay",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  overflow: "visible"
});

export default OverlayLayer;
