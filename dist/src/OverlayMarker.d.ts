/** @jsx h */
import { CustomOverlayMarker } from "./web-sdk";
interface OverlayMarkerProps extends CustomOverlayMarker {
    mapZoomFactor: number;
}
declare const OverlayMarker: FunctionComponent<OverlayMarkerProps>;
export default OverlayMarker;
