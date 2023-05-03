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
  mpath,
  style = "",
  className,
  mapZoomFactor,
  ...rest
}) => {
  let animateElement: any = null;
  if (Object.keys(animateMotion).length) {
    if (mpath) {
      animateElement = (
        <animateMotion {...animateMotion}>
          <mpath xlinkHref={`#${mpath}`} />
        </animateMotion>
      );
    } else {
      animateElement = <animateMotion {...animateMotion} />;
    }
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
      style={style}
      {...(rest as any)}
    >
      {animateElement}
    </circle>
  );
};

OverlayCircle.displayName = "OverlayPath";

export default OverlayCircle;
