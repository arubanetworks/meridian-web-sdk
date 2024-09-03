/** @jsx h */
import { CustomOverlayPolyline } from "./web-sdk";
interface OverlayPolygonProps extends CustomOverlayPolyline {
    mapZoomFactor: number;
}
declare const OverlayPolyline: FunctionComponent<OverlayPolygonProps>;
export default OverlayPolyline;
