/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayPolygon } from "./web-sdk";
import { asyncClientCall } from "./util";

interface OverlayPolygonProps extends CustomOverlayPolygon {
  mapZoomFactor: number;
}

const OverlayPolygon: FunctionComponent<OverlayPolygonProps> = ({
  points,
  fill = "hsla(207, 65%, 46%,  0.5)",
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  mapZoomFactor,
  onClick,
  data = {},
}) => {
  return (
    <polygon
      points={points.join(" ")}
      fill={fill}
      stroke={stroke}
      // Preact's TS types specify `strokeWidth` and `strokeLinejoin`,
      // but those don't actually seem to work correctly at all.
      // Luckily, Preact passes thru unknowns props as string
      // attributes, so using dashes works here.
      stroke-width={strokeWidth / mapZoomFactor}
      stroke-linejoin={strokeLineJoin}
      onClick={onClick ? () => asyncClientCall(onClick, data) : undefined}
      cursor={onClick ? "pointer" : undefined}
      pointer-events={onClick ? "all" : undefined}
    />
  );
};

OverlayPolygon.displayName = "OverlayPolygon";

export default OverlayPolygon;
