/** @jsx h */
import { CustomOverlayUse } from "./web-sdk";
interface OverlayUseProps extends CustomOverlayUse {
    mapZoomFactor: number;
}
declare const OverlayUse: FunctionComponent<OverlayUseProps>;
export default OverlayUse;
