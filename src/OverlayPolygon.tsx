/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayPolygon } from "./web-sdk";

interface OverlayPolygonProps extends CustomOverlayPolygon {
  mapZoomFactor: number;
}

const OverlayPolygon: FunctionComponent<OverlayPolygonProps> = ({
  points,
  fill = "hsla(207, 65%, 46%,  0.5)",
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  mapZoomFactor
}) => {
  return (
    <path
      d={pointsToPath(points)}
      fill={fill}
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

OverlayPolygon.displayName = "OverlayPolygon";

// Input  : [1, 2, 3, 4, 5, 6]
// Output : "M1,2 L3,4 L5,6 Z"
// Check out CSS Tricks for a great tutorial on how this sytanx works
// https://css-tricks.com/svg-path-syntax-illustrated-guide/
function pointsToPath(points: number[]): string {
  let x = points[0];
  let y = points[1];
  let d = `M${x},${y}`;
  for (let i = 2; i < points.length - 1; i += 2) {
    x = points[i];
    y = points[i + 1];
    d += ` L${x},${y}`;
  }
  return `${d} Z`;
}

export default OverlayPolygon;
