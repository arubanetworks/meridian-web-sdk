/** @jsx h */
import { MapComponentProps } from "./MapComponent";
import { API, CreateMapOptions, PlacemarkData, TagData } from "./web-sdk";
export interface PlacemarkLayerProps {
    selectedItem?: TagData | PlacemarkData;
    isPanningOrZooming: boolean;
    mapZoomFactor: number;
    locationID: string;
    floorID: string;
    api: API;
    placemarkOptions: CreateMapOptions["placemarks"];
    onPlacemarkClick: (placemark: PlacemarkData) => void;
    onUpdate: MapComponentProps["onPlacemarksUpdate"];
    toggleLoadingSpinner: (options: {
        show: boolean;
        source: string;
    }) => void;
    onInit: () => void;
}
export interface PlacemarkLayerState {
    fetchedPlacemarks: PlacemarkData[];
}
export default class PlacemarkLayer extends Component<PlacemarkLayerProps> {
    state: PlacemarkLayerState;
    isMounted: boolean;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: PlacemarkLayerProps): boolean;
    componentDidUpdate(prevProps: PlacemarkLayerProps, prevState: PlacemarkLayerState): Promise<void>;
    componentWillUnmount(): void;
    fetchPlacemarks(): Promise<void>;
    getFilteredPlacemarks(placemarks: PlacemarkData[]): PlacemarkData[];
    render(): h.JSX.Element;
}
