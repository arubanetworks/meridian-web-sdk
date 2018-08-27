import { h } from "preact";
import { css, theme, cx } from "./style";
import IconSpinner from "./IconSpinner";

const cssLoadingSpinner = css({
  label: "loading",
  position: "absolute",
  zIndex: 3,
  width: 30,
  left: 0,
  top: "45%",
  right: 0,
  overflow: "hidden",
  margin: "0 auto",
  color: theme.textColor,
  textAlign: "center",
  pointerEvents: "none"
});

const LoadingOverlay = () => (
  <div className={cx(cssLoadingSpinner, "meridian-loading-spinner")}>
    <IconSpinner />
  </div>
);

export default LoadingOverlay;
