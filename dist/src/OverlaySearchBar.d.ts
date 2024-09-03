/** @jsx h */
interface OverlayLayerSearchBarProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}
declare class OverlaySearchBar extends Component<OverlayLayerSearchBarProps> {
    input: HTMLInputElement | null;
    componentDidMount(): void;
    render(): h.JSX.Element;
}
export default OverlaySearchBar;
