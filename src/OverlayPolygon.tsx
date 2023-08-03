/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { asyncClientCall } from "./util";
import { CustomOverlayPolygon } from "./web-sdk";

interface OverlayPolygonProps extends CustomOverlayPolygon {
  mapZoomFactor: number;
}

const OverlayPolygon: FunctionComponent<OverlayPolygonProps> = ({
  defs = false,
  id,
  className,
  style,
  points,
  fill = "hsla(207, 65%, 46%,  0.5)",
  fillOpacity,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  markerStart,
  markerMid,
  markerEnd,
  mapZoomFactor,
  animate = {},
  data = {},
  onClick,
  ...rest
}) => {
  let animateElement: any = null;
  if (Object.keys(animate).length) {
    animateElement = <animate {...animate} />;
  }

  const polygon = (
    <polygon
      id={id}
      className={className}
      style={style}
      points={points.join(" ")}
      fill={fill}
      fill-opacity={fillOpacity}
      stroke={stroke}
      stroke-width={strokeWidth / mapZoomFactor}
      stroke-linejoin={strokeLineJoin}
      stroke-dasharray={strokeDasharray}
      stroke-dashoffset={strokeDashoffset}
      stroke-opacity={strokeOpacity}
      marker-start={markerStart}
      marker-mid={markerMid}
      marker-end={markerEnd}
      onClick={onClick ? () => asyncClientCall(onClick, data) : undefined}
      cursor={onClick ? "pointer" : undefined}
      pointer-events={onClick ? "all" : undefined}
      {...rest}
    >
      {animateElement}
    </polygon>
  );

  if (defs) {
    return <defs>{polygon}</defs>;
  }

  return polygon;
};

OverlayPolygon.displayName = "OverlayPolygon";

export default OverlayPolygon;
