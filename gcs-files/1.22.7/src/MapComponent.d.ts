/** @jsx h */
/// <reference types="lodash" />
import "d3-transition";
import { ZoomBehavior } from "d3-zoom";
import { Component, h } from "preact";
import { API, CreateMapOptions, FloorData, PlacemarkData, TagData } from "./web-sdk";
interface Box {
    width: number;
    height: number;
}
export interface MapComponentProps extends CreateMapOptions {
    destroy: () => void;
    update: (options: Partial<CreateMapOptions>) => void;
    api: API;
}
export interface MapComponentState {
    mapImageURL?: string;
    isFloorOverlayOpen: boolean;
    isAssetListOverlayOpen: boolean;
    isMapMarkerOverlayOpen: boolean;
    isErrorOverlayOpen: boolean;
    isPanningOrZooming: boolean;
    loadingSources: Record<string, any>;
    errors: any[];
    mapTransform: string;
    mapZoomFactor: number;
    floors: FloorData[];
    allPlacemarkData: PlacemarkData[];
    svgURL?: string;
    tagsConnection: any;
    tagsStatus: string;
    selectedItem?: PlacemarkData | TagData;
    areTagsLoading: boolean;
    arePlacemarksLoading: boolean;
    allTagData: TagData[];
}
declare class MapComponent extends Component<MapComponentProps, MapComponentState> {
    static defaultProps: {
        loadTags: boolean;
        loadPlacemarks: boolean;
        showSearchControl: boolean;
        showFloorsControl: boolean;
        floorsControlSortDescending: boolean;
        shouldMapPanZoom: () => boolean;
        width: string;
        height: string;
        placemarks: {};
        tags: {};
        overlays: never[];
        annotations: never[];
        onTagsUpdate: () => void;
        onFloorChange: () => void;
        onLoadingStateChange: () => void;
        onFloorsUpdate: () => void;
    };
    state: MapComponentState;
    isMounted: boolean;
    isLoaded: boolean;
    fetchAllTagsTimeout: any;
    fetchAllTagsInitialized: boolean;
    fetchAllPlacemarksTimeout: any;
    fetchAllPlacemarksInitialized: boolean;
    mapRef: import("preact").RefObject<HTMLDivElement>;
    mapContainerRef: import("preact").RefObject<HTMLDivElement>;
    mapImageref: import("preact").RefObject<HTMLImageElement>;
    intervalAutoDestroy: any;
    zoomD3?: ZoomBehavior<HTMLDivElement, unknown>;
    mapSelection?: Selection<HTMLDivElement, unknown, null, undefined>;
    mapContainerSize: Box | undefined;
    debouncedResizeFn: import("lodash").DebouncedFunc<() => void>;
    componentDidMount(): void;
    loadData(): Promise<void>;
    componentDidUpdate(prevProps: MapComponentProps): void;
    componentWillUnmount(): void;
    handleResize(): void;
    freeMapImageURL(): void;
    fetchMapImageURL(): Promise<void>;
    onTagsInit: () => void;
    onPlacemarksInit: () => void;
    updateMap: (newOptions: Partial<CreateMapOptions>) => void;
    validateFloorID(): void;
    fetchAllTags(options?: {
        forceUpdate: boolean;
    }): void;
    toggleAssetListOverlay: ({ open }: {
        open: boolean;
    }) => void;
    toggleFloorOverlay: ({ open }: {
        open: boolean;
    }) => void;
    toggleErrorOverlay: ({ open, message, }: {
        open: boolean;
        message?: string | undefined;
    }) => void;
    toggleLoadingSpinner: ({ show, source, }: {
        show: boolean;
        source?: string | undefined;
    }) => void;
    showLoadingSpinner(): boolean;
    toggleDetailsOverlay: ({ open, selectedItem, }: {
        open: boolean;
        selectedItem?: MapComponentState["selectedItem"];
    }) => void;
    selectFloorByID: (floorID: string) => void;
    fetchAllPlacemarks(options?: {
        forceUpdate: boolean;
    }): void;
    getFloors(): Promise<import("./web-sdk").LocationData[] | undefined>;
    getMapData(): FloorData | undefined;
    initializeFloors(): Promise<void>;
    addZoomBehavior(): void;
    resetExtents(): void;
    setExtents(mapWidth: number, mapHeight: number): void;
    zoomToDefault(): void;
    getMapRefSize(): {
        width: number;
        height: number;
    };
    centerMap(): void;
    zoomToPoint: (x: number, y: number, k: number) => void;
    zoomBy: (factor: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    onClick: (event: Event) => void;
    onTagClick: (tag: TagData) => Promise<void>;
    onPlacemarkClick: (placemark: PlacemarkData) => Promise<void>;
    shouldShowFloors(): boolean;
    renderFloorLabel(): h.JSX.Element | null;
    renderFloorOverlay(): h.JSX.Element | null;
    renderAssetListOverlay(): h.JSX.Element | null;
    renderDetailsOverlay(): h.JSX.Element | null;
    renderLoadingSpinner(): h.JSX.Element | null;
    renderErrorOverlay(): h.JSX.Element | null;
    render(): h.JSX.Element;
}
export default MapComponent;
