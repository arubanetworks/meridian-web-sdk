import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "meridian-button",
  styleUrl: "meridian-button.css",
  shadow: true
})
export class MeridianButton {
  render() {
    return (
      <button>
        <slot />
      </button>
    );
  }
}
