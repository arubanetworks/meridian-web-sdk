import { h } from "preact";
import PropTypes from "prop-types";

import { css } from "./style";

export default function DirectionsLayer(props) {
  // convert all points to float (they're strings by default)
  let steps = props.routeSteps.map(step => {
    const arr = step.split(",");
    return arr.map(point => parseFloat(point));
  });
  // flatten all the points since we're not concerned with "steps"
  steps = steps.flat();
  let vertices = "";
  for (let i = 0; i < steps.length - 2; i += 2) {
    const x1 = steps[i];
    const y1 = steps[i + 1];
    const x2 = steps[i + 2];
    const y2 = steps[i + 3];
    vertices += ` ${x1},${y1} ${x2},${y2}`;
  }
  return (
    <div
      className={css({
        label: "DirectionsLayer",
        position: "absolute",
        top: 0,
        left: 0
      })}
    >
      <svg height={props.height} width={props.width}>
        <polyline
          points={vertices}
          fill="none"
          stroke="#297BC0"
          style="stroke-width:22;stroke-opacity:0.3;stroke-linecap:round;stroke-dasharray:'4 1';"
        />
        <polyline
          points={vertices}
          fill="none"
          stroke="#297BC0"
          style="stroke-width:15;stroke-opacity:0.8;stroke-linecap:round;stroke-dasharray:'4 1';"
        />
      </svg>
    </div>
  );
}
DirectionsLayer.propTypes = {
  routeSteps: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number
};
