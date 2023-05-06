/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayCircle } from "./web-sdk";

interface OverlayCircleProps extends CustomOverlayCircle {
  mapZoomFactor: number;
}

const OverlayCircle: FunctionComponent<OverlayCircleProps> = ({
  id,
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
  animateMotion = {},
  animate = {},
  mpath,
  style = "",
  className,
  mapZoomFactor,
  ...rest
}) => {
  const scale = 1 / mapZoomFactor;
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

  return (
    <circle
      id={id}
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
      className={className}
      transform={`scale(${scale})`}
      style={style}
      {...(rest as any)}
    >
      {animateElement}
      {animateMotionElement}
    </circle>
  );
};

OverlayCircle.displayName = "OverlayPath";

export default OverlayCircle;
