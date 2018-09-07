import { h } from "preact";
import PropTypes from "prop-types";

import { mixins, theme, css, cx } from "./style";

const cssLabel = css(mixins.rounded, {
  label: "label",
  display: "inline-block",
  padding: "2px 6px",
  marginRight: "8px",
  background: theme.borderColor,
  color: theme.black
});

const Label = ({ name }) => (
  <div className={cx("meridian-label", cssLabel)}>{name}</div>
);

Label.propTypes = {
  name: PropTypes.string.isRequired
};

const LabelList = ({ labels }) => (
  <div>
    {labels.map((l, i) => (
      <Label key={i} name={l} />
    ))}
  </div>
);

LabelList.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LabelList;
