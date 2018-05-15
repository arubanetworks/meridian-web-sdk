import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "meridian-map-icon",
  styleUrl: "map-icon.css",
  shadow: true
})
export class MeridianIcon {
  render() {
    return (
      <svg width="16" height="16">
        <use fill="black" xlinkHref="/assets/tag.svg#tag" />
        {/* <image id="fds" width="16" height="16" xlinkHref="/assets/tag.svg" /> */}
      </svg>
    );
  }
}
