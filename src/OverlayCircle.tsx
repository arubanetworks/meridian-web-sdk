/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { asyncClientCall } from "./util";
import { CustomOverlayCircle } from "./web-sdk";

interface OverlayCircleProps extends CustomOverlayCircle {
  mapZoomFactor: number;
}

const OverlayCircle: FunctionComponent<OverlayCircleProps> = ({
  defs = false,
  id,
  className,
  style = {},
  cx,
  cy,
  r,
  pathLength,
  fill = "black",
  fillOpacity = "1",
  stroke = "none",
  strokeWidth = 4,
  strokeLineJoin,
  strokeLineCap,
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  animate = {},
  animateMotion = {},
  mpath,
  data = {},
  onClick,
  mapZoomFactor,
  ...rest
}) => {
  const scale = 1 / mapZoomFactor;
  let animateElement: any = null;
  let animateMotionElement: any = null;

  const elementStyle = {
    transform: `scale(${scale})`,
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

  const circle = (
    <circle
      id={id}
      className={className}
      style={elementStyle}
      cx={cx}
      cy={cy}
      r={r}
      path-length={pathLength}
      fill={fill}
      fill-opacity={fillOpacity}
      stroke={stroke}
      stroke-width={strokeWidth / mapZoomFactor}
      stroke-linejoin={strokeLineJoin}
      stroke-linecap={strokeLineCap}
      stroke-dasharray={strokeDasharray}
      stroke-dashoffset={strokeDashoffset}
      stroke-opacity={strokeOpacity}
      onClick={onClick ? () => asyncClientCall(onClick, data) : undefined}
      cursor={onClick ? "pointer" : undefined}
      pointer-events={onClick ? "all" : undefined}
      {...rest}
    >
      {animateElement}
      {animateMotionElement}
    </circle>
  );

  if (defs) {
    return <defs>{circle}</defs>;
  }

  return circle;
};

OverlayCircle.displayName = "OverlayCircle";

export default OverlayCircle;
