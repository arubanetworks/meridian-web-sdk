/** @jsx h */
import { CustomOverlayPolygon } from "./web-sdk";
interface OverlayPolygonProps extends CustomOverlayPolygon {
    mapZoomFactor: number;
}
declare const OverlayPolygon: FunctionComponent<OverlayPolygonProps>;
export default OverlayPolygon;
