/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayPolyline } from "./web-sdk";

type OverlayPolygonProps = CustomOverlayPolyline & {
  mapZoomFactor: number;
};

const OverlayPolyline: FunctionComponent<OverlayPolygonProps> = ({
  points,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  mapZoomFactor
}) => {
  return (
    <polyline
      points={pointsToPolyline(points)}
      stroke={stroke}
      // Preact's TS types specify `strokeWidth` and `strokeLinejoin`,
      // but those don't actually seem to work correctly at all.
      // Luckily, Preact passes thru unknowns props as string
      // attributes, so using dashes works here.
      stroke-width={strokeWidth / mapZoomFactor}
      stroke-linejoin={strokeLineJoin}
    />
  );
};

OverlayPolyline.displayName = "OverlayPolyline";

// Input  : [1, 2, 3, 4, 5, 6]
// Output : "1,2 3,4 5,6"
// Check out CSS Tricks for a great tutorial on how this sytanx works
// https://css-tricks.com/svg-path-syntax-illustrated-guide/
function pointsToPolyline(points: number[]): string {
  let x = points[0];
  let y = points[1];
  let d = `${x},${y}`;
  for (let i = 2; i < points.length - 1; i += 2) {
    x = points[i];
    y = points[i + 1];
    d += ` ${x},${y}`;
  }
  return d;
}

export default OverlayPolyline;
