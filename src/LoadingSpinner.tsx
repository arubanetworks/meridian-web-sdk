/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, theme } from "./style";
import IconSpinner from "./IconSpinner";

const LoadingOverlay: FunctionComponent = () => {
  return (
    <div className={cssLoadingSpinner}>
      <IconSpinner />
    </div>
  );
};

const cssLoadingSpinner = css({
  label: "loading",
  position: "absolute",
  zIndex: 1,
  width: 30,
  left: 0,
  top: "45%",
  right: 0,
  overflow: "hidden",
  margin: "0 auto",
  color: theme.textColor,
  textAlign: "center",
  pointerEvents: "none",
});

export default LoadingOverlay;
