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
  defs = false,
  id,
  className,
  style,
  points,
  fill = "none",
  fillOpacity,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  strokeLineCap = "butt",
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  markerStart,
  markerMid,
  markerEnd,
  animate = {},
  mapZoomFactor,
  ...rest
}) => {
  let animateElement: any = null;
  if (Object.keys(animate).length) {
    animateElement = <animate {...animate} />;
  }

  const polyline = (
    <polyline
      id={id}
      className={className}
      style={style}
      points={points.join(" ")}
      fill={fill}
      fill-opacity={fillOpacity}
      stroke={stroke}
      stroke-width={strokeWidth / mapZoomFactor}
      stroke-linejoin={strokeLineJoin}
      stroke-linecap={strokeLineCap}
      stroke-dasharray={strokeDasharray}
      stroke-dashoffset={strokeDashoffset}
      stroke-opacity={strokeOpacity}
      marker-start={markerStart}
      marker-mid={markerMid}
      marker-end={markerEnd}
      {...rest}
    >
      {animateElement}
    </polyline>
  );

  if (defs) {
    return <defs>{polyline}</defs>;
  }
  return polyline;
};

OverlayPolyline.displayName = "OverlayPolyline";

export default OverlayPolyline;
