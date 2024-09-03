/** @jsx h */
import MapComponent from "./MapComponent";
interface FloorAndTagControlsProps {
    showFloors: boolean;
    showSearch: boolean;
    toggleFloorOverlay: MapComponent["toggleFloorOverlay"];
    toggleAssetListOverlay: MapComponent["toggleAssetListOverlay"];
}
declare const FloorAndTagControls: FunctionComponent<FloorAndTagControlsProps>;
export default FloorAndTagControls;
