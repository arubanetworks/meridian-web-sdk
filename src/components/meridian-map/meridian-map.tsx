import _ from "lodash";
import { Component, Prop, State } from "@stencil/core";
// import { userInfo } from "os";
const { MeridianWebModels } = global as any;

const api = MeridianWebModels.create({
  environment: "staging",
  token: "058d11ddcf1e7c75912e31600c3c0eb0fcee6532"
});

const seconds = s => s * 1000;

interface Tag {
  mac: string;
  x: number;
  y: number;
}

@Component({
  tag: "meridian-map",
  styleUrl: "meridian-map.css",
  shadow: true
})
export class MeridianMap {
  @Prop() locationId: string;
  @Prop() floorId: string;

  @State() currentText: string = "";
  @State() svgUrl: string = "";
  @State() tags: Record<string, Tag> = {};
  @State() connection: any;

  async componentDidLoad() {
    console.info("component loaded");
    this.connection = api.floor.listen({
      locationId: this.locationId,
      id: this.floorId,
      onUpdate: data => {
        const { mac } = data;
        const { x, y } = data.calculations.default.location;
        const tag = { mac, x, y };
        this.tags = { ...this.tags, [mac]: tag };
        console.log(tag);
      }
    });
    setTimeout(() => {
      this.connection.close();
    }, seconds(60));
    const { data } = await api.floor.get(this.locationId, this.floorId);
    this.svgUrl = data.svg_url;
  }

  renderTags() {
    const tags = this.tags;
    return _.keys(tags).map(mac => {
      const t = tags[mac];
      const { x, y } = tags[mac];
      return <circle class="tag" cx={x} cy={y} r="10" />;
    });
  }

  render() {
    // TODO: How do we avoid hard coding the viewbox here since that information
    // is contained within the SVG referenced by the SVG URL
    if (this.svgUrl) {
      return (
        <div>
          <meridian-map-marker />
          <svg class="map" viewBox="0 0 1700 2200">
            <image width="1700" height="2200" xlinkHref={this.svgUrl} />
            {this.renderTags()}
          </svg>
        </div>
      );
    }
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
}
