/** @jsx h */
import { CustomOverlayImage } from "./web-sdk";
interface OverlayImage extends CustomOverlayImage {
    mapZoomFactor: number;
}
declare const OverlayImage: FunctionComponent<OverlayImage>;
export default OverlayImage;
