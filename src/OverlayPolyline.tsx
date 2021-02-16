/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayPolyline } from "./web-sdk";

interface OverlayPolygonProps extends CustomOverlayPolyline {
  mapZoomFactor: number;
}

const OverlayPolyline: FunctionComponent<OverlayPolygonProps> = ({
  points,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  strokeLineCap = "butt",
  mapZoomFactor
}) => {
  return (
    <polyline
      points={points.join(" ")}
      fill="none"
      stroke={stroke}
      // Preact's TS types specify `strokeWidth` and `strokeLinejoin`,
      // but those don't actually seem to work correctly at all.
      // Luckily, Preact passes thru unknowns props as string
      // attributes, so using dashes works here.
      stroke-width={strokeWidth / mapZoomFactor}
      stroke-linejoin={strokeLineJoin}
      stroke-linecap={strokeLineCap}
    />
  );
};

OverlayPolyline.displayName = "OverlayPolyline";

export default OverlayPolyline;
