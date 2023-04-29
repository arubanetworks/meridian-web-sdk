/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayPath } from "./web-sdk";

interface OverlayPathProps extends CustomOverlayPath {
  mapZoomFactor: number;
}

const OverlayPath: FunctionComponent<OverlayPathProps> = ({
  id,
  shape,
  fill = "none",
  fillOpacity,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  className,
  style,
  mapZoomFactor,
}) => {
  return (
    <path
      id={id}
      d={shape}
      fill={fill}
      fill-opacity={fillOpacity}
      stroke={stroke}
      stroke-width={strokeWidth / mapZoomFactor}
      className={className}
      style={style}
    />
  );
};

OverlayPath.displayName = "OverlayPath";

export default OverlayPath;
