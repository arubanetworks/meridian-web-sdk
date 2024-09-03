/** @jsx h */
import { TagData } from "./web-sdk";
interface TagProps {
    isSelected: boolean;
    data: TagData;
    mapZoomFactor: number;
    onClick?: (tag: TagData) => void;
    disabled?: boolean;
}
declare const Tag: FunctionComponent<TagProps>;
export default Tag;
