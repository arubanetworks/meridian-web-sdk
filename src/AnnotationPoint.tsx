/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css } from "./style";
import { CustomAnnotationPoint } from "./web-sdk";

type AnnotationPointProps = CustomAnnotationPoint & {
  mapZoomFactor: number;
};

const AnnotationPoint: FunctionComponent<AnnotationPointProps> = ({
  mapZoomFactor,
  x,
  y,
  // TODO: Good defaults
  size = 24,
  backgroundColor = "hsl(207, 65%, 46%)",
  backgroundImage,
  title = "TEST TEST"
}) => {
  return (
    <div
      className={cssAnnotationPoint}
      style={{
        "--meridian-annotation-x": `${x}px`,
        "--meridian-annotation-y": `${y}px`,
        "--meridian-annotation-scale": 1 / mapZoomFactor,
        "--meridian-annotation-size": `${size}px`,
        "--meridian-annotation-backgroundColor": backgroundColor,
        "--meridian-annotation-backgroundImage": backgroundImage
          ? `url('${backgroundImage}')`
          : "none"
      }}
      // TODO: Draw underneath, not as native tooltip
      title={title}
    />
  );
};

const cssAnnotationPoint = css({
  label: "AnnotationPoint",
  transform: [
    "translate(var(--meridian-annotation-x), var(--meridian-annotation-y))",
    "scale(var(--meridian-annotation-scale))"
  ].join(" "),
  width: "var(--meridian-annotation-size)",
  height: "var(--meridian-annotation-size)",
  backgroundColor: "var(--meridian-annotation-backgroundColor)",
  backgroundImage: "var(--meridian-annotation-backgroundImage)",
  backgroundSize: "cover",
  borderRadius: 9999
});

AnnotationPoint.displayName = "AnnotationPoint";

export default AnnotationPoint;
