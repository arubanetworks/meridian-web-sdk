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

// Chrome requires that SVGs be at least 1x1 in order for `overflow: visible` to
// work, so we're also adding `point-events: none` so that you can't click
// anything in this layer.
const cssOverlay = css({
  label: "overlay-layer",
  position: "absolute",
  overflow: "visible",
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  pointerEvents: "none"
});

export default OverlayLayer;
