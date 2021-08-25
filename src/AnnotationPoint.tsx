/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, mixins } from "./style";
import { CustomAnnotationPoint } from "./web-sdk";
import { asyncClientCall } from "./util";

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
  title,
  onClick,
  data = {}
}) => {
  return (
    <div
      className={cssAnnotationPoint}
      style={{
        "--meridian-annotationPoint-x": `${x}px`,
        "--meridian-annotationPoint-y": `${y}px`,
        "--meridian-annotationPoint-scale": 1 / mapZoomFactor,
        "--meridian-annotationPoint-size": `${size}px`,
        "--meridian-annotationPoint-backgroundColor": backgroundColor,
        "--meridian-annotationPoint-backgroundSize": backgroundSize,
        "--meridian-annotationPoint-backgroundImage": backgroundImage
          ? `url('${backgroundImage}')`
          : "none",
        cursor: onClick ? "pointer" : "initial"
      }}
      onClick={onClick ? () => asyncClientCall(onClick, data) : undefined}
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
  top: "var(--meridian-annotationPoint-y)",
  left: "var(--meridian-annotationPoint-x)",
  transform: "translate(-50%, -50%) scale(var(--meridian-annotationPoint-scale))",
  width: "var(--meridian-annotationPoint-size)",
  height: "var(--meridian-annotationPoint-size)",
  backgroundColor: "var(--meridian-annotationPoint-backgroundColor)",
  backgroundImage: "var(--meridian-annotationPoint-backgroundImage)",
  backgroundSize: "var(--meridian-annotationPoint-backgroundSize)",
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
  marginTop: "var(--meridian-annotationPoint-size)",
  paddingTop: 4,
  color: "#222",
  userSelect: "none",
  transform: "translate(-50%, 0)",
  fontWeight: "bold"
});

AnnotationPoint.displayName = "AnnotationPoint";

export default AnnotationPoint;
