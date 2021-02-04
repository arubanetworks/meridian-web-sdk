/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import AnnotationPoint from "./AnnotationPoint";
import { css } from "./style";
import { CustomAnnotation } from "./web-sdk";

type AnnotationLayerProps = {
  mapZoomFactor: number;
  annotations: CustomAnnotation[];
};

const AnnotationLayer: FunctionComponent<AnnotationLayerProps> = ({
  mapZoomFactor,
  annotations
}) => {
  return (
    <div
      className={cssOverlay}
      data-testid="meridian--private--annotation-layer"
    >
      {annotations.map((obj, i) => {
        switch (obj.type) {
          case "point":
            return (
              <AnnotationPoint key={i} {...obj} mapZoomFactor={mapZoomFactor} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const cssOverlay = css({
  label: "overlay",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  overflow: "visible"
});

export default AnnotationLayer;
