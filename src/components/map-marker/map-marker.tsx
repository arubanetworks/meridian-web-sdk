import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "meridian-map-marker",
  shadow: true
})
export class MapMarker {
  render() {
    return <p>I am a map marker</p>;
  }
}
