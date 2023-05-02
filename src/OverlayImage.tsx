/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { CustomOverlayImage } from "./web-sdk";

interface OverlayImage extends CustomOverlayImage {
  mapZoomFactor: number;
}

const OverlayImage: FunctionComponent<OverlayImage> = ({
  width,
  height,
  href,
  x,
  y,
  id,
  className,
  animateMotion = {},
  style = "",
  mpath,
  mapZoomFactor,
  ...rest
}) => {
  const scale = 1 / mapZoomFactor;

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
    <image
      width={width}
      height={height}
      href={href}
      x={x}
      y={y}
      id={id}
      className={className}
      transform={`translate(-${width / mapZoomFactor / 2} -${
        height / mapZoomFactor / 2
      }) scale(${scale})`}
      style={style}
      {...rest}
    >
      {animateElement}
    </image>
  );
};

OverlayImage.displayName = "OverlayImage";

export default OverlayImage;
