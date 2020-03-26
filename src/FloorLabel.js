/** @jsx h */
import { h } from "preact";
import PropTypes from "prop-types";

import { css, mixins, cx } from "./style";
import { STRINGS } from "./util";

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
    fontSize: 16
  }
);

const FloorLabel = ({ buildingName, floorName }) => (
  <div className={cx("meridian-floor-label", cssFloorLabel)}>
    {buildingName || STRINGS.unnamedBuilding} {STRINGS.enDash} {floorName}
  </div>
);

FloorLabel.propTypes = {
  buildingName: PropTypes.string.isRequired,
  floorName: PropTypes.string.isRequired
};

export default FloorLabel;
