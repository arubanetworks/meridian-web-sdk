/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import MapComponent from "./MapComponent";
import { css, theme, mixins, cx } from "./style";

interface FloorAndTagControlsProps {
  showFloors: boolean;
  showSearch: boolean;
  toggleFloorOverlay: MapComponent["toggleFloorOverlay"];
  toggleAssetListOverlay: MapComponent["toggleAssetListOverlay"];
}

const FloorAndTagControls: FunctionComponent<FloorAndTagControlsProps> = ({
  toggleFloorOverlay,
  toggleAssetListOverlay,
  showFloors,
  showSearch,
}) => {
  return (
    <div className={cssFloorAndTagControls}>
      {showSearch ? (
        <button
          className={cx("meridian-tag-control", cssControl)}
          data-testid="meridian--private--tag-control"
          onClick={() => {
            toggleAssetListOverlay({ open: true });
          }}
        >
          {/* TODO: Can we get this SVG fixed up? */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
            <path d="M26.19 25l-4.12-4.12a7.29 7.29 0 001.44-4.35 7.11 7.11 0 00-7-7.2 7.11 7.11 0 00-7 7.2 7.11 7.11 0 007 7.2 6.83 6.83 0 004.16-1.42l4.1 4.1A1 1 0 0026.19 25zm-14.68-8.49a5.11 5.11 0 015-5.2 5.11 5.11 0 015 5.2 5.11 5.11 0 01-5 5.2 5.11 5.11 0 01-5-5.2z" />
          </svg>
        </button>
      ) : null}

      {showFloors ? (
        <button
          className={cx(
            "meridian-floor-control",
            showFloors && showSearch ? cssControlNotFirst : cssControl
          )}
          data-testid="meridian--private--floor-control"
          onClick={() => {
            toggleFloorOverlay({ open: true });
          }}
        >
          <svg viewBox="0 0 36 36">
            <path d="M28.4 14.09a1.84 1.84 0 0 0-.62-.39l-8.48-3.33a3.61 3.61 0 0 0-1.3-.22 3.56 3.56 0 0 0-1.3.22L8.22 13.7a1.83 1.83 0 0 0-.62.39 1.24 1.24 0 0 0 0 1.82 1.85 1.85 0 0 0 .62.39l8.48 3.34a3.92 3.92 0 0 0 2.59 0l8.48-3.34a1.86 1.86 0 0 0 .62-.39 1.24 1.24 0 0 0 0-1.82m-9.83 3.68a2 2 0 0 1-1.13 0l-7-2.77 7-2.77a2 2 0 0 1 1.13 0l7 2.77zm9.83 2.32a1.24 1.24 0 0 1 0 1.82 1.86 1.86 0 0 1-.62.39l-8.47 3.33a3.92 3.92 0 0 1-2.59 0L8.22 22.3a1.85 1.85 0 0 1-.62-.39 1.24 1.24 0 0 1 0-1.82 1.83 1.83 0 0 1 .62-.39L10 19l2.73 1.08-2.34.92 7 2.77a2 2 0 0 0 1.13 0l7-2.77-2.35-.92L26 19l1.79.7a1.84 1.84 0 0 1 .62.39" />
          </svg>
        </button>
      ) : null}
    </div>
  );
};

const cssFloorAndTagControls = css({
  label: "floor-and-tag-controls",
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  zIndex: 1,
  right: 15,
  top: 15,
});

const cssControl = css(
  mixins.buttonReset,
  mixins.shadow,
  mixins.rounded,
  mixins.buttonHoverActive,
  mixins.focusRing,
  {
    label: "control",
    cursor: "pointer",
    background: "white",
    padding: 4,
    width: 40,
    height: 40,
    border: 0,
    fontSize: 20,
    fontWeight: 200,
    fill: theme.brandBrightBlue,
  }
);

const cssControlNotFirst = css(cssControl, {
  marginTop: 10,
});

export default FloorAndTagControls;
