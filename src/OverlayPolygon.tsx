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
  fillOpacity,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  id,
  className,
  style,
  mapZoomFactor,
  animate = {},
  onClick,
  data = {},
  ...rest
}) => {
  let animateElement: any = null;
  if (Object.keys(animate).length) {
    animateElement = <animate {...animate} />;
  }

  return (
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
      onClick={onClick ? () => asyncClientCall(onClick, data) : undefined}
      cursor={onClick ? "pointer" : undefined}
      pointer-events={onClick ? "all" : undefined}
      {...rest}
    >
      {animateElement}
    </polygon>
  );
};

OverlayPolygon.displayName = "OverlayPolygon";

export default OverlayPolygon;
