/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import PropTypes from "prop-types";

import { mixins, theme, css } from "./style";

const cssLabel = css(mixins.maxRounded, {
  label: "label",
  display: "inline-block",
  padding: "3px 8px",
  marginBottom: 8,
  marginRight: 8,
  background: "rgba(0, 0, 0, 0.035)",
  color: "#3b3b3b"
});

const Label = ({ name }) => <div className={cssLabel}>{name}</div>;

Label.propTypes = {
  name: PropTypes.string.isRequired
};

const getCSSLabelList = ({ align, fontSize }) =>
  css({
    label: "label-list",
    fontSize,
    marginTop: 8,
    marginLeft: 3,
    textAlign: align,
    flex: "1 1 auto"
  });

const LabelList = ({ align, labels, fontSize = theme.fontSize }) =>
  labels.length === 0 ? null : (
    <div className={getCSSLabelList({ align, fontSize })}>
      {labels.map((l, i) => (
        <Label key={i} name={l} />
      ))}
    </div>
  );

LabelList.propTypes = {
  fontSize: PropTypes.string,
  align: PropTypes.oneOf(["left", "right"]).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LabelList;
