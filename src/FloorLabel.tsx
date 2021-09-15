/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, cx, mixins } from "./style";
import { uiText } from "./util";

interface FloorLabelProps {
  buildingName: string;
  floorName: string;
}

const FloorLabel: FunctionComponent<FloorLabelProps> = ({
  buildingName,
  floorName,
}) => (
  <div
    className={cx("meridian-floor-label", cssFloorLabel)}
    data-testid="meridian--private--floor-label"
  >
    {buildingName || uiText.unnamedBuilding} {uiText.enDash} {floorName}
  </div>
);

const cssFloorLabel = css(
  mixins.buttonReset,
  mixins.rounded,
  mixins.overflowEllipses,
  {
    label: "floor-control",
    background: "rgba(0, 0, 0, 0.4)",
    color: "white",
    textShadow: "0 0 2px black",
    position: "absolute",
    zIndex: 1,
    bottom: 15,
    left: "50%",
    transform: "translate(-50%, 0)",
    textAlign: "center",
    maxWidth: 300,
    padding: "8px 16px",
    border: 0,
    fontSize: 16,
  }
);

export default FloorLabel;
