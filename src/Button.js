import { h } from "preact";
import { css } from "emotion";

import theme from "./theme";

const className = css({
  border: "0",
  padding: "0.25em 0.5em",
  borderRadius: "0.25em",
  background: theme.brandBlue,
  color: theme.white,
  fontFamily: theme.fontFamily,
  fontSize: theme.fontSize
});

const Button = ({ children, onClick }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

export default Button;
