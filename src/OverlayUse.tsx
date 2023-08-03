/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayUse } from "./web-sdk";

interface OverlayUseProps extends CustomOverlayUse {
  mapZoomFactor: number;
}

const OverlayUse: FunctionComponent<OverlayUseProps> = ({
  defs = false,
  id,
  className,
  style = {},
  width,
  height,
  href,
  x,
  y,
  fill = "none",
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  strokeLineCap = "butt",
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  animate = {},
  animateMotion = {},
  mpath,
  mapZoomFactor,
  ...rest
}) => {
  const scale = 1 / mapZoomFactor;
  let animateElement: any = null;
  let animateMotionElement: any = null;

  const elementStyle = {
    transform: `translate(-${width / mapZoomFactor / 2}px, -${
      height / mapZoomFactor / 2
    }px) scale(${scale})`,
    ...style,
  };

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
    <use
      id={id}
      className={className}
      style={elementStyle}
      width={width}
      height={height}
      href={href}
      x={x}
      y={y}
      fill={fill}
      stroke={stroke}
      stroke-width={strokeWidth / mapZoomFactor}
      stroke-linejoin={strokeLineJoin}
      stroke-linecap={strokeLineCap}
      stroke-dasharray={strokeDasharray}
      stroke-dashoffset={strokeDashoffset}
      stroke-opacity={strokeOpacity}
      {...rest}
    >
      {animateElement}
      {animateMotionElement}
    </use>
  );

  if (defs) {
    return <defs>{path}</defs>;
  }

  return path;
};

OverlayUse.displayName = "OverlayUse";

export default OverlayUse;
