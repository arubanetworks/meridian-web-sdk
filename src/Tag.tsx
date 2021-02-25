/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import defaultTagImageURL from "../files/tags/generic.svg";
import { TagData } from "./data";
import { css, cx, mixins } from "./style";
import { getTagLabels } from "./util";

const SIZE = 48;
const SHRINK_POINT = 0.2;
const SHRINK_FACTOR = 1.4;

interface TagProps {
  isSelected: boolean;
  data: TagData;
  mapZoomFactor: number;
  onClick?: (tag: TagData) => void;
  disabled?: boolean;
}

const Tag: FunctionComponent<TagProps> = ({
  isSelected,
  data,
  mapZoomFactor,
  onClick = () => {},
  disabled = false
}) => {
  const shrinkFactor = mapZoomFactor < SHRINK_POINT ? SHRINK_FACTOR : 1;
  const k = 1 / mapZoomFactor / shrinkFactor;
  const imageURL = data.image_url || defaultTagImageURL;
  return (
    <button
      data-meridian-tag-id={data.id}
      disabled={disabled}
      className={cx(
        "meridian-tag",
        cssTag,
        getTagLabels(data).map((label: string) => {
          label = label.replace(/ /g, "-").replace(/[^a-z0-9_-]/i, "");
          return `meridian-tag-label-${label}`;
        }),
        isSelected && ["meridian-tag-selected", cssTagSelected]
      )}
      style={{
        left: data.x,
        top: data.y,
        transform: `translate(-50%, -50%) scale(${k})`,
        "--meridian-tag-imageURL": `url('${imageURL}')`
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
  );
};

const cssTag = css(
  mixins.shadow,
  mixins.buttonReset,
  mixins.pointer,
  mixins.focusNone,
  {
    label: "tag",
    width: SIZE,
    height: SIZE,
    borderRadius: "100%",
    position: "absolute",
    backgroundImage: "var(--meridian-tag-imageURL)",
    backgroundColor: "white",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    border: "2px solid white",
    overflow: "hidden",
    transition: `
      width 80ms ease,
      height 80ms ease,
      top 500ms ease,
      left 500ms ease
    `,
    zIndex: 2
  }
);

const cssTagSelected = css(cssTag, {
  width: SIZE * 1.25,
  height: SIZE * 1.25,
  zIndex: 3,
  boxShadow: "0 0 0 2px white, 0 0 4px black"
});

export default Tag;
