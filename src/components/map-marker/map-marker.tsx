import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "meridian-map-marker",
  styleUrl: "map-marker.scss",
  shadow: true
})
export class MapMarker {
  render() {
    return <p class="marker">Hola bro?</p>;
  }
}
