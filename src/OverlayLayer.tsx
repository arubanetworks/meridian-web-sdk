/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import { css } from "./style";
import { CustomOverlay } from "./web-sdk";

type OverlayLayerProps = {
  mapZoomFactor: number;
  overlays: CustomOverlay[];
};

const OverlayLayer = ({ mapZoomFactor, overlays }: OverlayLayerProps) => {
  return (
    <svg className={cssOverlay} data-testid="meridian--private--overlay-layer">
      {overlays.map((obj, i) => {
        switch (obj.type) {
          case "polygon": {
            const {
              points,
              fill = "hsla(207, 65%, 46%,  0.5)",
              stroke = "hsl(207, 65%, 46%)",
              strokeWidth = 2,
              strokeLineJoin = "miter"
            } = obj;
            return (
              <path
                key={i}
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
          }
          default:
            return null;
        }
      })}
    </svg>
  );
};

// Input  : [1, 2, 3, 4, 5, 6]
// Output : "M 1 2 L 3 4 L 5 6 Z"
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
