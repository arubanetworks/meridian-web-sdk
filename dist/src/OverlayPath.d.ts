/** @jsx h */
import { CustomOverlayPath } from "./web-sdk";
interface OverlayPathProps extends CustomOverlayPath {
    mapZoomFactor: number;
}
declare const OverlayPath: FunctionComponent<OverlayPathProps>;
export default OverlayPath;
