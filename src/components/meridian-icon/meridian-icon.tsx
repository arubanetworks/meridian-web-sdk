import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "meridian-icon",
  styleUrl: "meridian-icon.css",
  shadow: true
})
export class MeridianIcon {
  render() {
    return (
      <svg width="16" height="16">
        <use fill="black" xlinkHref="/assets/tag.svg#tag" />
      </svg>
    );
  }
}
