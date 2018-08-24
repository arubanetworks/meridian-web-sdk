import { h } from "preact";

import { css, theme, cx } from "./style";

const cssLoadingSpinner = css({
  label: "spinner",
  overflow: "hidden",
  color: theme.textColor,
  position: "absolute",
  left: 0,
  top: "48%",
  right: 0,
  zIndex: 4,
  textAlign: "center"
});

const LoadingOverlay = () => (
  <div className={cx(cssLoadingSpinner, "meridian-loading-spinner")}>
    this is a spinner
  </div>
);

export default LoadingOverlay;
