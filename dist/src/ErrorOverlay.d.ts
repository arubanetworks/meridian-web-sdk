/** @jsx h */
import MapComponent from "./MapComponent";
interface ErrorOverlayProps {
    toggleErrorOverlay: MapComponent["toggleErrorOverlay"];
    messages: string[];
}
declare const ErrorOverlay: FunctionComponent<ErrorOverlayProps>;
export default ErrorOverlay;
