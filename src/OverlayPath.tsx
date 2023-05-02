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
  stroke = "hsl(207, 65%, 46%)",
  strokeWidth = 2,
  strokeLineJoin = "miter",
  strokeLineCap = "butt",
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
    <path
      id={id}
      d={shape}
      fill={fill}
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
    </path>
  );
};

OverlayPath.displayName = "OverlayPath";

export default OverlayPath;
