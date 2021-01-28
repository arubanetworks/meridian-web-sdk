/* eslint-disable react/no-unknown-property */
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

// TODO: Fix eslint to use PREACT instead of REACT
// https://github.com/preactjs/eslint-config-preact
const OverlayLayer = ({ mapZoomFactor, overlays }: OverlayLayerProps) => {
  // TODO: Validate the overlays input
  return (
    <svg className={cssOverlay}>
      {overlays.map((obj, i) => {
        switch (obj.type) {
          case "polygon": {
            const {
              points,
              // TODO: Pick better colors and sizes here
              fill = "red",
              stroke = "green",
              strokeWidth = 3,
              strokeLineJoin = "miter"
            } = obj;
            return (
              <path
                key={i}
                d={pointsToPath(points)}
                fill={fill}
                stroke={stroke}
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
  label: "meridian-overlay",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  overflow: "visible"
});

export default OverlayLayer;
