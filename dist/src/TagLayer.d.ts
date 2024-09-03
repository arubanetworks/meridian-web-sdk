/** @jsx h */
/// <reference types="lodash" />
import { Component, h } from "preact";
import { MapComponentProps } from "./MapComponent";
import { API, PlacemarkData, TagData } from "./web-sdk";
export interface TagLayerProps {
    selectedItem?: TagData | PlacemarkData;
    isPanningOrZooming: boolean;
    mapZoomFactor: number;
    locationID: string;
    floorID: string;
    api: API;
    tagOptions?: {
        filter?: (tag: TagData) => boolean;
        showControlTags?: boolean;
        disabled?: boolean;
        updateInterval?: number;
    };
    onTagClick: (tag: TagData) => void;
    onUpdate: MapComponentProps["onTagsUpdate"];
    toggleLoadingSpinner: (options: {
        show: boolean;
        source: string;
    }) => void;
    onInit: () => void;
}
export interface TagLayerState {
    tagsByMAC: Record<string, TagData>;
    connectionsByFloorID: Record<string, any>;
}
export default class TagLayer extends Component<TagLayerProps, TagLayerState> {
    state: TagLayerState;
    tagUpdates: {};
    isMounted: boolean;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: TagLayerProps): boolean;
    componentDidUpdate(prevProps: TagLayerProps): void;
    componentWillUnmount(): void;
    commitTagUpdates: import("lodash").DebouncedFunc<() => void>;
    connect(floorID: string): void;
    disconnect(floorID: string): void;
    filterControlTags(tags: TagData[]): TagData[];
    onUpdate: () => void;
    render(): h.JSX.Element;
}
