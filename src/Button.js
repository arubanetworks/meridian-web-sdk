import { h } from "preact";
import PropTypes from "prop-types";

import { mixins, theme, css } from "./style";

const className = css({
  label: "button",

  border: "0",
  padding: "0.25em 0.5em",
  ...mixins.rounded,
  // borderRadius: "0.25em",
  background: theme.brandBlue,
  color: theme.white,
  fontFamily: theme.fontFamily,
  fontSize: theme.fontSize,

  "&:focus": {
    outline: "0",
    boxShadow: `
      0 0 0 2px white,
      0 0 0 4px black
    `
  },

  "&:hover": {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
  }
});

const Button = ({ children, onClick = () => {} }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func
};

export default Button;
