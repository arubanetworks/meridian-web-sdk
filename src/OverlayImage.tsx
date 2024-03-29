/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { asyncClientCall } from "./util";
import { CustomOverlayImage } from "./web-sdk";

interface OverlayImage extends CustomOverlayImage {
  mapZoomFactor: number;
}

const OverlayImage: FunctionComponent<OverlayImage> = ({
  defs = false,
  id,
  className,
  style = {},
  width,
  height,
  href,
  x,
  y,
  animate = {},
  animateMotion = {},
  mpath,
  mapZoomFactor,
  onClick,
  data = {},
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

  const image = (
    <image
      id={id}
      className={className}
      style={elementStyle}
      width={width}
      height={height}
      href={href}
      x={x}
      y={y}
      onClick={onClick ? () => asyncClientCall(onClick, data) : undefined}
      cursor={onClick ? "pointer" : undefined}
      pointer-events={onClick ? "all" : undefined}
      {...rest}
    >
      {animateElement}
      {animateMotionElement}
    </image>
  );

  if (defs) {
    return <defs>{image}</defs>;
  }

  return image;
};

OverlayImage.displayName = "OverlayImage";

export default OverlayImage;
