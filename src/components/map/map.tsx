import _ from "lodash";
import { Component, Prop, State, Element } from "@stencil/core";

const { MeridianWebModels } = global as any;
const { SVG, panZoom } = global as any;
const seconds = s => s * 1000;

const api = MeridianWebModels.create({
  environment: "staging",
  token: "058d11ddcf1e7c75912e31600c3c0eb0fcee6532"
});

interface Tag {
  mac: string;
  x: number;
  y: number;
}

@Component({
  tag: "meridian-map",
  styleUrl: "map.css",
  shadow: true
})
export class MeridianMap {
  @Element() el: HTMLElement;

  @Prop() locationId: string;
  @Prop() floorId: string;

  @State() currentText: string = "";
  @State() svgUrl: string = "";
  @State() tags: Record<string, Tag> = {};
  @State() connection: any;

  async componentDidLoad() {
    this.connection = api.floor.listen({
      locationId: this.locationId,
      id: this.floorId,
      onUpdate: data => {
        const { mac } = data;
        const { x, y } = data.calculations.default.location;
        const tag = { mac, x, y };
        this.tags = { ...this.tags, [mac]: tag };
      }
    });
    setTimeout(() => {
      this.connection.close();
    }, seconds(60));

    const { data } = await api.floor.get(this.locationId, this.floorId);
    this.svgUrl = data.svg_url;

    setTimeout(() => {
      console.info("component loaded");
      var element = this.el.shadowRoot.querySelector(".map .svg_parent");
      console.info("element", element);
      var foo = SVG.adopt(element);
      foo.panZoom({ zoomMin: 0.25, zoomMax: 20 });
    }, seconds(1));
  }

  renderTags() {
    const tags = this.tags;
    return _.keys(tags).map(mac => {
      const t = tags[mac];
      const { x, y } = tags[mac];
      // return <circle class="tag" cx={x} cy={y} r="10" />;
      return (
        <use
          fill="black"
          width="23"
          height="23"
          x={x}
          y={y}
          xlinkHref="/assets/tag.svg#tag"
        />
      );
    });
  }

  render() {
    if (this.svgUrl) {
      return (
        <svg class="map" viewBox="0 0 1700 2200">
          <g class="svg_parent">
            <image
              id="svg_map_image"
              width="1700"
              height="2200"
              xlinkHref={this.svgUrl}
            />
            {this.renderTags()}
          </g>
        </svg>
      );
    }
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
}
