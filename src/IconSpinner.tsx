/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, keyframes } from "./style";

const IconSpinner: FunctionComponent = () => <div className={cssSpinner} />;

const cssSpin = keyframes({
  from: {
    transform: "rotate(0turn)",
  },
  to: {
    transform: "rotate(1turn)",
  },
});

const cssSpinner = css({
  label: "spinner",
  width: 22,
  height: 22,
  margin: "0 auto",
  border: "2px rgba(227, 227, 227, 0.9) solid",
  borderTop: "2px #2e7cbe solid",
  borderRadius: "50%",
  animation: `${cssSpin} 600ms infinite linear`,
});

export default IconSpinner;
