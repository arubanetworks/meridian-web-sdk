import { h } from "preact";

import { css, theme, cx, keyframes } from "./style";

const cssLoadingSpinner = css({
  label: "spinner",
  overflow: "hidden",
  color: theme.textColor,
  position: "absolute",
  left: 0,
  top: "45%",
  right: 0,
  zIndex: 3,
  textAlign: "center",
  width: 32,
  margin: "0 auto",
  pointerEvents: "none"
});

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
`;

const cssSpinner = css({
  width: 24,
  height: 24,
  margin: "0 auto",
  border: "4px rgba(0,0,0,0.25) solid",
  borderTop: "4px rgba(0,0,0,1) solid",
  borderRadius: "50%",
  animation: `${spin} .6s infinite linear`
});

const LoadingOverlay = () => (
  <div className={cx(cssLoadingSpinner, "meridian-loading-spinner")}>
    <div className={cx(cssSpinner, "meridian-spinner")} />
  </div>
);

export default LoadingOverlay;
