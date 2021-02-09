/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { FunctionComponent, h } from "preact";
import { css, mixins, theme } from "./style";

interface LabelListProps {
  align: "left" | "right";
  fontSize?: string | number;
  labels: string[];
}

const LabelList: FunctionComponent<LabelListProps> = ({
  align,
  labels,
  fontSize = theme.fontSize
}) => {
  if (labels.length === 0) {
    return null;
  }
  return (
    <div
      className={cssLabelList}
      style={{
        "--meridian-labelList-fontSize": fontSize,
        "--meridian-labelList-textAlign": align
      }}
    >
      {labels.map((label, i) => (
        <div key={i} className={cssLabel}>
          {label}
        </div>
      ))}
    </div>
  );
};

const cssLabelList = css({
  label: "label-list",
  fontSize: "var(--meridian-labelList-fontSize)",
  marginTop: 8,
  marginLeft: 3,
  textAlign: "var(--meridian-labelList-textAlign)" as any,
  flex: "1 1 auto"
});

const cssLabel = css(mixins.maxRounded, {
  label: "label",
  display: "inline-block",
  padding: "3px 8px",
  marginBottom: 8,
  marginRight: 8,
  background: "rgba(0, 0, 0, 0.035)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  color: "#3b3b3b"
});

export default LabelList;
