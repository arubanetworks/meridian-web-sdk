/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import Placemark from "./Placemark";
import Tag from "./Tag";

interface MapMarkerProps {
  selectedItem?: Record<string, any>;
  kind: "tag" | "placemark";
  data: Record<string, any>;
  mapZoomFactor: number;
  disabled?: boolean;
  onClick?: (data: Record<string, any>) => void;
}

const MapMarker: FunctionComponent<MapMarkerProps> = ({
  selectedItem,
  kind,
  data,
  mapZoomFactor,
  disabled,
  onClick = () => {}
}) => {
  if (kind === "tag") {
    return (
      <Tag
        isSelected={selectedItem ? selectedItem.mac === data.mac : false}
        mapZoomFactor={mapZoomFactor}
        data={data}
        onClick={() => {
          onClick(data);
        }}
        disabled={disabled}
      />
    );
  }
  if (kind === "placemark") {
    return (
      <Placemark
        isSelected={selectedItem ? selectedItem.id === data.id : false}
        mapZoomFactor={mapZoomFactor}
        data={data}
        onClick={() => {
          onClick(data);
        }}
        disabled={disabled}
      />
    );
  }
  return null;
};

export default MapMarker;
