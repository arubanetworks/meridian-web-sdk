/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import PropTypes from "prop-types";

import { css } from "./style";

export default function DirectionsLayer(props) {
  // convert all points to float (they're strings by default) and flatten the result
  const steps = props.routeSteps.flatMap(step => {
    const arr = step.split(",");
    return arr.map(point => Number(point));
  });
  const pointsArray = [];
  for (let i = 0; i < steps.length - 2; i += 2) {
    const x1 = steps[i];
    const y1 = steps[i + 1];
    const x2 = steps[i + 2];
    const y2 = steps[i + 3];
    pointsArray.push(`${x1},${y1}`);
    pointsArray.push(`${x2},${y2}`);
  }
  const points = pointsArray.join(" ");
  return (
    <div className={cssDirectionsLayer}>
      <svg height={props.height} width={props.width}>
        <polyline
          className={cssOuterPolyline}
          points={points}
          fill="none"
          stroke="#297BC0"
        />
        <polyline
          className={cssInnerPolyline}
          points={points}
          fill="none"
          stroke="#297BC0"
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

const cssDirectionsLayer = css({
  label: "DirectionsLayer",
  position: "absolute",
  top: 0,
  left: 0
});
const cssOuterPolyline = css({
  strokeWidth: 22,
  strokeOpacity: 0.3,
  strokeLinecap: "round",
  strokeDasharray: "4 1"
});
const cssInnerPolyline = css({
  strokeWidth: 15,
  strokeOpacity: 0.8,
  strokeLinecap: "round",
  strokeDasharray: "4 1"
});
