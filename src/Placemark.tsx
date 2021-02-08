/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, cx, mixins, theme } from "./style";
import { placemarkIconURL } from "./web-sdk";

const SIZE = 24;
const SHRINK_POINT = 0.2;
const SHRINK_FACTOR = 1.4;

interface PlacemarkProps {
  isSelected: boolean;
  data: Record<string, any>;
  mapZoomFactor: number;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
}

const Placemark: FunctionComponent<PlacemarkProps> = ({
  isSelected,
  data,
  mapZoomFactor,
  onClick = () => {},
  disabled = false
}) => {
  const cssTypeName = `meridian-placemark-type-${data.type}`;
  const labelOnly = !data.type || data.type.indexOf("label_") === 0;
  const shrinkFactor = mapZoomFactor < SHRINK_POINT ? SHRINK_FACTOR : 1;
  const k = 1 / mapZoomFactor / shrinkFactor;
  const color = `#${data.color}`;
  const iconURL = placemarkIconURL(data.type);
  const iconClassName = isSelected
    ? cx(
        "meridian-placemark-icon-selected",
        "meridian-placemark-icon",
        cssTypeName,
        cssPlacemarkIconSelected
      )
    : cx("meridian-placemark-icon", cssTypeName, cssPlacemarkIcon);
  const style = {
    left: data.x,
    top: data.y,
    transform: `translate(-50%, -50%) scale(${k})`
  } as const;

  if (labelOnly) {
    return (
      <div className={cx("meridian-placemark", cssPlacemark)} style={style}>
        <div
          className={cx(
            cssLabel,
            cssLabelOnly,
            "meridian-label",
            "meridian-label-only"
          )}
          data-meridian-placemark-id={data.next_id}
        >
          {data.name}
        </div>
      </div>
    );
  }
  return (
    <div className={cx("meridian-placemark", cssPlacemark)} style={style}>
      <button
        disabled={disabled}
        className={iconClassName}
        data-meridian-placemark-id={data.next_id}
        style={{
          "--meridian-placemark-iconURL": `url('${iconURL}')`,
          "--meridian-placemark-borderColor": color,
          "--meridian-placemark-backgroundColor": color
        }}
        onClick={event => {
          if (event.target instanceof HTMLElement) {
            event.target.focus();
          }
          onClick(event);
        }}
        onMouseDown={event => {
          event.stopPropagation();
        }}
      />
      <div
        className={cx("meridian-label", cssLabel)}
        hidden={mapZoomFactor < SHRINK_POINT}
      >
        {data.name}
      </div>
    </div>
  );
};

const cssLabel = css(mixins.textStrokeWhite, {
  label: "placemark-label",
  marginLeft: "50%",
  position: "absolute",
  minWidth: 55,
  maxWidth: 120,
  fontSize: 14,
  textAlign: "center",
  paddingTop: 4,
  color: "#222",
  userSelect: "none",
  transform: "translate(-50%, 0)",
  fontWeight: "bold",
  visibility: "visible",

  "&[hidden]": {
    visibility: "hidden"
  }
});

const cssLabelOnly = css({
  label: "placemark-labelOnly",
  textTransform: "uppercase",
  color: "#666",
  fontSize: 16
});

const cssPlacemark = css({
  label: "placemark",
  position: "absolute"
});

const cssPlacemarkIcon = css(
  mixins.buttonReset,
  mixins.pointer,
  mixins.focusNone,
  {
    label: "placemark-icon",
    "--meridian-placemark-backgroundColor": theme.brandBlue,
    transition: "width 80ms ease, height 80ms ease",
    display: "block",
    width: SIZE,
    height: SIZE,
    borderRadius: "100%",
    backgroundColor: "var(--meridian-placemark-backgroundColor)",
    backgroundImage: "var(--meridian-placemark-iconURL)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    border: "2px solid transparent",
    overflow: "hidden",
    zIndex: 1
  }
);

const cssPlacemarkIconSelected = css(cssPlacemarkIcon, {
  zIndex: 3,
  width: SIZE * 1.25,
  height: SIZE * 1.25,
  boxShadow: "0 0 4px black"
});

export default Placemark;
