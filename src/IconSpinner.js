import { h } from "preact";
import { css, keyframes, cx } from "./style";

const cssSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const cssSpinner = css({
  label: "spinner",
  width: 22,
  height: 22,
  margin: "0 auto",
  border: "2px rgba(227, 227, 227, 0.9) solid",
  borderTop: "2px #2e7cbe solid",
  borderRadius: "50%",
  animation: `${cssSpin} 600ms infinite linear`
});

const IconSpinner = () => (
  <div className={cx(cssSpinner, "meridian-spinner")} />
);

export default IconSpinner;
