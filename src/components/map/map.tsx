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
  shadow: false
})
export class MeridianMap {
  @Element() el: HTMLElement;

  @Prop() locationId: string;
  @Prop() floorId: string;

  @State() loaded: boolean;
  @State() currentText: string = "";
  @State() svgUrl: string = "";
  @State() tags: Record<string, Tag> = {};
  @State() connection: any;
  @State() connectionStatus: string = "Not Connected";

  closeConnection() {
    console.info("calling close");
    this.connection.close();
    this.connectionStatus = "Closed";
  }

  initMapControls() {
    console.info("init map controls");
    console.info("this.el", this.el);
    var element = this.el.querySelector(".svg_parent");
    console.info("element", element);
    // var foo = SVG.adopt(element);
    // foo.panZoom({ zoomMin: 0.25, zoomMax: 20 });
  }

  componentDidUpdate() {
    console.log("Component did update");
  }

  async componentDidLoad() {
    console.info("Component did load");

    const { data } = await api.floor.get(this.locationId, this.floorId);
    this.svgUrl = data.svg_url;
    this.loaded = true;

    this.connection = api.floor.listen({
      locationId: this.locationId,
      id: this.floorId,
      onUpdate: data => {
        this.connectionStatus = "Connected";
        const { mac } = data;
        const { x, y } = data.calculations.default.location;
        const tag = { mac, x, y };
        this.tags = { ...this.tags, [mac]: tag };
      }
    });
    setTimeout(() => {
      this.closeConnection();
    }, seconds(60));

    this.initMapControls();
  }

  renderTags() {
    const tags = this.tags;
    return _.keys(tags).map(mac => {
      const t = tags[mac];
      const { x, y } = tags[mac];
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
    return (
      <div>
        <p>
          <button onClick={() => this.closeConnection()}>
            Close Connection
          </button>
          <span> Status: {this.connectionStatus}</span>
        </p>
        <div>
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
        </div>
      </div>
    );
  }
}
