import { h } from "preact";
import { css } from "./style";

const IconDirections = () => (
  <svg className={cssIconDirections} viewBox="0 0 36 36">
    <path d="M10.8 29a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4h7V9a1.86 1.86 0 0 1 1.8-2 2.35 2.35 0 0 1 1.54.64l7.07 6.11a2.82 2.82 0 0 1 1 2.11 2.68 2.68 0 0 1-.94 2L21.11 24a2.33 2.33 0 0 1-1.52.63 1.86 1.86 0 0 1-1.79-2.08V20h-3v5a4 4 0 0 1-4 4m0-15a2 2 0 0 0-2 2v9a2 2 0 0 0 4 0v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v3.47l7.15-6.12a.68.68 0 0 0 .25-.52.8.8 0 0 0-.3-.6l-7.07-6.1V13a1 1 0 0 1-1 1h-8z" />
  </svg>
);

const cssIconDirections = css({
  width: 32,
  height: 32,
  fill: "#297BC0"
});

export default IconDirections;
