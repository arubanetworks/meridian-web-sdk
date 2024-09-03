/** @jsx h */
import { CustomAnnotation } from "./web-sdk";
interface AnnotationLayerProps {
    mapZoomFactor: number;
    annotations: CustomAnnotation[];
}
declare const AnnotationLayer: FunctionComponent<AnnotationLayerProps>;
export default AnnotationLayer;
