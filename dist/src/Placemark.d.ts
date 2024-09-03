/** @jsx h */
import { CreateMapPlacemarksOptions, PlacemarkData } from "./web-sdk";
interface PlacemarkProps {
    isSelected: boolean;
    data: PlacemarkData;
    mapZoomFactor: number;
    onClick?: (placemark: PlacemarkData) => void;
    disabled?: boolean;
    labelMode: CreateMapPlacemarksOptions["labelMode"];
    labelZoomLevel: CreateMapPlacemarksOptions["labelZoomLevel"];
}
declare const Placemark: FunctionComponent<PlacemarkProps>;
export default Placemark;
