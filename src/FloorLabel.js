import { h } from "preact";
import PropTypes from "prop-types";

import { css, mixins, cx } from "./style";

const cssFloorLabel = css({
  label: "floor-control",
  ...mixins.buttonReset,
  ...mixins.rounded,
  ...mixins.elideText,
  background: "rgba(0, 0, 0, 0.5)",
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
  fontWeight: "bold"
});

// TODO: Actually allow switching floors
const FloorLabel = ({ buildingName, floorName }) => (
  <div className={cx(cssFloorLabel, "meridian-floor-label")}>
    {buildingName} &ndash; {floorName}
  </div>
);

FloorLabel.propTypes = {
  buildingName: PropTypes.string,
  floorName: PropTypes.string
};

export default FloorLabel;
