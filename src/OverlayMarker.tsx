/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayMarker } from "./web-sdk";

interface OverlayMarkerProps extends CustomOverlayMarker {
  mapZoomFactor: number;
}

const OverlayMarker: FunctionComponent<OverlayMarkerProps> = ({
  defs = true,
  id,
  className,
  style,
  viewBox,
  refX,
  refY,
  markerWidth,
  markerHeight,
  orient,
  fill = "none",
  fillOpacity,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth,
  strokeLineJoin,
  strokeLineCap,
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  shapeElementType,
  shapeElementAttributes,
  mapZoomFactor: _mapZoomFactor,
  ...rest
}) => {
  let shape: any = null;

  if (Object.keys(shapeElementAttributes).length && shapeElementType) {
    switch (shapeElementType) {
      case "path":
        shape = <path {...shapeElementAttributes} />;
        break;
      case "polyline":
        shape = <polyline {...shapeElementAttributes} />;
        break;
      case "polygon":
        shape = <polygon {...shapeElementAttributes} />;
        break;
      case "circle":
        shape = <circle {...shapeElementAttributes} />;
        break;
      case "image":
        shape = <image {...shapeElementAttributes} />;
        break;
    }
  }

  const marker = (
    <marker
      id={id}
      className={className}
      style={style}
      viewBox={viewBox}
      refX={refX}
      refY={refY}
      markerWidth={markerWidth}
      markerHeight={markerHeight}
      orient={orient}
      fill={fill}
      fill-opacity={fillOpacity}
      stroke={stroke}
      stroke-width={strokeWidth}
      stroke-linejoin={strokeLineJoin}
      stroke-linecap={strokeLineCap}
      stroke-dasharray={strokeDasharray}
      stroke-dashoffset={strokeDashoffset}
      stroke-opacity={strokeOpacity}
      {...rest}
    >
      {shape}
    </marker>
  );

  if (defs) {
    return <defs>{marker}</defs>;
  }
  return marker;
};

OverlayMarker.displayName = "OverlayMarker";

export default OverlayMarker;
