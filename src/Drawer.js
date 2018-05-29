import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme, mixins } from "./style";

const drawerStyle = css({
  label: "drawer",
  border: `1px solid ${theme.borderColor}`,
  background: "#fafafa",
  color: "#000",
  ...mixins.paddingMedium,
});

const Drawer = ({ x, y, id, onClick = () => {}, children }) => {
  return (
    <div className={drawerStyle}>
      {children}
    </div>
  );
};

Drawer.PropTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Drawer;
