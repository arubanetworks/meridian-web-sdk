/** @jsx h */
import MapComponent from "./MapComponent";
import { PlacemarkData, TagData } from "./web-sdk";
interface DetailsOverlayProps {
    kind: "tag" | "placemark";
    item: TagData | PlacemarkData;
    toggleDetailsOverlay: MapComponent["toggleDetailsOverlay"];
}
declare const DetailsOverlay: FunctionComponent<DetailsOverlayProps>;
export default DetailsOverlay;
