import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "meridian-icon",
  styleUrl: "meridian-icon.css",
  shadow: true
})
export class MeridianIcon {
  render() {
    return (
      <svg width="36" height="36" style={{ border: "2px solid" }}>
        {/* <use
          fill="red"
          xlinkHref="/assets/icons.svg#src/components/icons/Icon/svgs/_tag_2TW9-"
        /> */}
        <use fill="magenta" xlinkHref="/assets/tag.svg#tag" />
      </svg>
    );
  }
}
