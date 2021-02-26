/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import AnnotationPoint from "./AnnotationPoint";
import { CustomAnnotation } from "./web-sdk";

interface AnnotationLayerProps {
  mapZoomFactor: number;
  annotations: CustomAnnotation[];
}

const AnnotationLayer: FunctionComponent<AnnotationLayerProps> = ({
  mapZoomFactor,
  annotations
}) => {
  return (
    <div data-testid="meridian--private--annotation-layer">
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

export default AnnotationLayer;
