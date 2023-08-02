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
  shapeElementType,
  shapeElementAttributes,
  viewBox,
  refX,
  refY,
  markerWidth,
  markerHeight,
  orient,
  fill = "none",
  fillOpacity,
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  strokeLineCap = "butt",
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  id,
  className,
  style,
  mapZoomFactor,
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

  return (
    <defs>
      <marker
        id={id}
        className={className}
        style={style}
        fill={fill}
        fill-opacity={fillOpacity}
        viewBox={viewBox}
        refX={refX}
        refY={refY}
        markerWidth={markerWidth}
        markerHeight={markerHeight}
        orient={orient}
        stroke={stroke}
        stroke-width={strokeWidth / mapZoomFactor}
        stroke-linejoin={strokeLineJoin}
        stroke-linecap={strokeLineCap}
        stroke-dasharray={strokeDasharray}
        stroke-dashoffset={strokeDashoffset}
        stroke-opacity={strokeOpacity}
        {...rest}
      >
        {shape}
      </marker>
    </defs>
  );
};

OverlayMarker.displayName = "OverlayMarker";

export default OverlayMarker;
