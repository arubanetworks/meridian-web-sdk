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
  defs = false,
  id,
  className,
  style = {},
  shape,
  fill = "none",
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
  animateMotion = {},
  mpath,
  mapZoomFactor,
  ...rest
}) => {
  let animateElement: any = null;
  let animateMotionElement: any = null;

  if (Object.keys(animateMotion).length) {
    if (mpath) {
      animateMotionElement = (
        <animateMotion {...animateMotion}>
          <mpath xlinkHref={`#${mpath}`} />
        </animateMotion>
      );
    } else {
      animateMotionElement = <animateMotion {...animateMotion} />;
    }
  }

  if (Object.keys(animate).length) {
    animateElement = <animate {...animate} />;
  }

  const path = (
    <path
      id={id}
      className={className}
      style={style}
      d={shape}
      fill={fill}
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
      {animateMotionElement}
    </path>
  );

  if (defs) {
    return <defs>{path}</defs>;
  }

  return path;
};

OverlayPath.displayName = "OverlayPath";

export default OverlayPath;
