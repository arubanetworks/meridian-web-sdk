import { h } from "preact";
import PropTypes from "prop-types";

import { mixins, theme, css, cx } from "./style";

const cssLabel = css(mixins.maxRounded, {
  label: "label",
  display: "inline-block",
  padding: "3px 8px",
  border: `1px solid ${theme.borderColorDarker}`,
  marginBottom: 8,
  marginRight: 8,
  fontSize: theme.fontSizeSmaller,
  background: theme.white,
  color: "#3b3b3b"
});

const Label = ({ name }) => (
  <div className={cx("meridian-label", cssLabel)}>{name}</div>
);

Label.propTypes = {
  name: PropTypes.string.isRequired
};

const getCSSLabelList = ({ align }) =>
  css({
    label: "label-list",
    textAlign: align,
    flex: "1 1 auto"
  });

const LabelList = ({ align, labels }) => (
  <div className={cx("meridian-label-list", getCSSLabelList({ align }))}>
    {labels.map((l, i) => (
      <Label key={i} name={l} />
    ))}
  </div>
);

LabelList.propTypes = {
  align: PropTypes.oneOf(["left", "right"]).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LabelList;
