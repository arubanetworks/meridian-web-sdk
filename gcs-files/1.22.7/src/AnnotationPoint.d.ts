/** @jsx h */
import { CustomAnnotationPoint } from "./web-sdk";
interface AnnotationPointProps extends CustomAnnotationPoint {
    mapZoomFactor: number;
}
declare const AnnotationPoint: FunctionComponent<AnnotationPointProps>;
export default AnnotationPoint;
