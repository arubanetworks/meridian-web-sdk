/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, mixins } from "./style";
import { CustomAnnotationPoint } from "./web-sdk";

interface AnnotationPointProps extends CustomAnnotationPoint {
  mapZoomFactor: number;
}

const AnnotationPoint: FunctionComponent<AnnotationPointProps> = ({
  mapZoomFactor,
  x,
  y,
  size = 24,
  backgroundColor = "hsl(207, 65%, 46%)",
  backgroundSize = "cover",
  backgroundImage,
  title
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
        "--meridian-annotation-backgroundSize": backgroundSize,
        "--meridian-annotation-backgroundImage": backgroundImage
          ? `url('${backgroundImage}')`
          : "none"
      }}
      data-testid="meridian--private--annotation-point"
    >
      {title ? (
        <div
          className={cssAnnotationPointLabel}
          data-testid="meridian--private--annotation-point-title"
        >
          {title}
        </div>
      ) : null}
    </div>
  );
};

const cssAnnotationPoint = css({
  label: "AnnotationPoint",
  position: "absolute",
  top: "var(--meridian-annotation-y)",
  left: "var(--meridian-annotation-x)",
  transform: "scale(var(--meridian-annotation-scale))",
  width: "var(--meridian-annotation-size)",
  height: "var(--meridian-annotation-size)",
  backgroundColor: "var(--meridian-annotation-backgroundColor)",
  backgroundImage: "var(--meridian-annotation-backgroundImage)",
  backgroundSize: "var(--meridian-annotation-backgroundSize)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  borderRadius: 9999,
  userSelect: "none"
});

const cssAnnotationPointLabel = css(mixins.textStrokeWhite, {
  label: "AnnotationPoint-Label",
  marginLeft: "50%",
  position: "absolute",
  minWidth: 55,
  maxWidth: 120,
  fontSize: 14,
  textAlign: "center",
  marginTop: "var(--meridian-annotation-size)",
  paddingTop: 4,
  color: "#222",
  userSelect: "none",
  transform: "translate(-50%, 0)",
  fontWeight: "bold"
});

AnnotationPoint.displayName = "AnnotationPoint";

export default AnnotationPoint;
