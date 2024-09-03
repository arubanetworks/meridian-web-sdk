/** @jsx h */
import { Component, h } from "preact";
import { LanguageCodes } from "./Translations";
import { FloorData } from "./web-sdk";
export interface FloorOverlayProps {
    toggleFloorOverlay: (options: {
        open: boolean;
    }) => void;
    currentFloorID: string;
    floors: FloorData[];
    sortDescending: boolean;
    selectFloorByID: (floorID: string) => void;
    language?: LanguageCodes;
}
declare class FloorOverlay extends Component<FloorOverlayProps> {
    state: {
        searchFilter: string;
    };
    searchInputRef: import("preact").RefObject<HTMLInputElement>;
    componentDidMount(): void;
    render(): h.JSX.Element;
}
export default FloorOverlay;
