/** @jsx h */
import { CustomOverlayCircle } from "./web-sdk";
interface OverlayCircleProps extends CustomOverlayCircle {
    mapZoomFactor: number;
}
declare const OverlayCircle: FunctionComponent<OverlayCircleProps>;
export default OverlayCircle;
