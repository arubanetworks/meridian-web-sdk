/** @jsx h */
import { CustomOverlay } from "./web-sdk";
interface OverlayLayerProps {
    mapZoomFactor: number;
    overlays: CustomOverlay[];
}
declare const OverlayLayer: FunctionComponent<OverlayLayerProps>;
export default OverlayLayer;
