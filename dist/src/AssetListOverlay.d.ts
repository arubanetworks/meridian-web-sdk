/** @jsx h */
import { Component, h } from "preact";
import { LanguageCodes } from "./Translations";
import { CreateMapOptions, FloorData, PlacemarkData, TagData } from "./web-sdk";
type SearchType = "tags" | "placemarks";
interface AssetListOverlayProps {
    onTagClick: (tag: TagData) => void;
    onPlacemarkClick: (placemark: PlacemarkData) => void;
    tagsLoading: boolean;
    placemarksLoading: boolean;
    tags: TagData[];
    placemarks: PlacemarkData[];
    showControlTags: boolean;
    floors: FloorData[];
    tagOptions: CreateMapOptions["tags"];
    placemarkOptions: CreateMapOptions["placemarks"];
    updateMap: (options: Partial<CreateMapOptions>) => void;
    currentFloorID: string;
    toggleAssetListOverlay: (options: {
        open: boolean;
    }) => void;
    showTags: boolean;
    showPlacemarks: boolean;
    language?: LanguageCodes;
}
declare class AssetListOverlay extends Component<AssetListOverlayProps> {
    state: {
        searchFilter: string;
        searchType: SearchType;
    };
    searchInputRef: import("preact").RefObject<HTMLInputElement>;
    setRadioFilter: (filter: SearchType) => void;
    componentDidMount(): void;
    render(): h.JSX.Element;
}
export default AssetListOverlay;
