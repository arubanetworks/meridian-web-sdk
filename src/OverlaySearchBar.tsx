/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { Component, h } from "preact";
import { css, mixins, theme } from "./style";

interface OverlayLayerSearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

class OverlaySearchBar extends Component<OverlayLayerSearchBarProps> {
  input: HTMLInputElement | null = null;

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const { value, onChange, placeholder } = this.props;
    return (
      <div className={cssSearchBar}>
        <svg viewBox="0 0 15 15" className={cssSearchIcon}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.2454 12.5741L9.55123 8.73956C10.2134 7.80246 10.5682 6.66953 10.5632 5.50756C10.5506 2.47441 8.18614 0.0175744 5.26286 5.57178e-05C3.8639 -0.00651157 2.52051 0.567712 1.53197 1.59481C0.543427 2.6219 -0.0081584 4.01655 9.12228e-05 5.46806C0.0127262 8.50148 2.37737 10.9585 5.30093 10.9761C6.42539 10.9811 7.52128 10.6088 8.42505 9.91456L8.4289 9.91156L12.1197 13.7431C12.3193 13.9603 12.6166 14.0482 12.8966 13.9728C13.1765 13.8973 13.395 13.6704 13.4675 13.3799C13.5399 13.0894 13.455 12.7809 13.2454 12.5741ZM5.29738 9.87819C2.95866 9.86423 1.06697 7.8988 1.05671 5.47219C1.0504 4.31114 1.4917 3.19564 2.28239 2.37403C3.07307 1.55242 4.14751 1.09287 5.26653 1.09769C7.60525 1.11165 9.49694 3.07709 9.5072 5.50369C9.51352 6.66475 9.07221 7.78024 8.28152 8.60186C7.49084 9.42347 6.4164 9.88302 5.29738 9.87819Z"
            transform="translate(0.637695)"
          />
        </svg>

        <input
          data-testid="meridian--private--overlay-search"
          value={value}
          type="text"
          placeholder={placeholder}
          className={cssSearchInput}
          onInput={(event) => {
            if (event.target instanceof HTMLInputElement) {
              onChange(event.target.value);
            }
          }}
          ref={(element) => {
            this.input = element;
          }}
        />
      </div>
    );
  }
}

const cssSearchInput = css(
  mixins.buttonReset,
  mixins.rounded,
  mixins.focusRing,
  {
    label: "overlay-search-input",
    flex: "1 1 auto",
    marginRight: 42,
    fontSize: 16,
    padding: "4px 8px",
    paddingLeft: 30,
    background: theme.borderColor,
    color: theme.black,
    border: 0,
    height: 24,

    "&::placeholder": {
      color: theme.textColorBluishLightGrey,
    },
  }
);

const cssSearchIcon = css({
  label: "overlay-search-icon",
  position: "absolute",
  zIndex: 1,
  fill: theme.textColorBluish,
  width: 16,
  height: 16,
  top: 18,
  left: 18,
});

const cssSearchBar = css({
  label: "overlay-search-bar",
  position: "relative",
  zIndex: 1,
  flex: "0 0 auto",
  display: "flex",
  flexDirection: "column",
  padding: 10,
  backgroundColor: "rgb(105, 146, 176)",
});

export default OverlaySearchBar;
