import { h, Component } from "preact";
import PropTypes from "prop-types";
import svg from "svg.js";
import "svg.panzoom.js";

import Button from "./Button";
import ZoomButtons from "./ZoomButtons";
import Drawer from "./Drawer";
import Tags from "./Tags";
import { css } from "./style";

const cssMapSvg = css({
  label: "map",
  position: "relative",
  border: "1px solid #ccc",
  background: "#fafafa",
  color: "#000",
  fontWeight: "bold"
});

export default class Map extends Component {
  static propTypes = {
    zoom: PropTypes.bool,
    locationId: PropTypes.string.isRequired,
    floorId: PropTypes.string.isRequired,
    api: PropTypes.object,
    show: PropTypes.shape({
      // Either "all" or an array of IDs (all caps MAC address no colons)
      tags: PropTypes.oneOfType([
        PropTypes.oneOf(["all"]),
        PropTypes.arrayOf(PropTypes.string)
      ])
    }),
    /** onMarkerClick */
    onMarkerClick: PropTypes.func,
    /** onMapClick */
    onMapClick: PropTypes.func
  };

  static defaultProps = {
    zoom: true,
    show: {}
  };

  state = {
    tagsById: {},
    svgUrl: null,
    tagsConnection: null,
    tagsStatus: "Connecting",
    selectedItem: {}
  };

  async componentDidMount() {
    const { locationId, floorId, api } = this.props;
    const url = `locations/${locationId}/maps/${floorId}`;
    const { data } = await api.axios.get(url);
    this.setState({ svgUrl: data.svg_url });
  }

  initMap() {
    // console.info("the map is like totally initialized and ready");
  }

  onMapClick(e) {
    const mapClicked =
      this.mapSvg.isEqualNode(e.target) || this.mapImage.isEqualNode(e.target);
    if (this.props.onMapClick && mapClicked) {
      this.props.onMapClick(e);
    } else {
      if (mapClicked) {
        this.setState({ selectedItem: {} });
      }
    }
  }

  onMarkerClick = data => {
    // console.info(data);
    if (this.props.onMarkerClick) {
      this.props.onMarkerClick(data);
    } else {
      this.setState({ selectedItem: data });
    }
  };

  onTagsUpdate = (connection, status) => {
    this.setState({
      tagsConnection: connection,
      tagsStatus: status
    });
  };

  renderZoomControls() {
    if (this.props.zoom && this.mapSvg) {
      const map = svg.adopt(this.mapSvg);
      map.panZoom({ zoomMin: 0.25, zoomMax: 20 });
      return <ZoomButtons map={map} />;
    }
    return null;
  }

  renderTagsStatus() {
    if (this.props.show.tags) {
      return <span> Status: {this.state.tagsStatus} </span>;
    }
    return null;
  }

  renderTagsConnection() {
    const { tagsConnection } = this.state;
    if (this.props.show.tags && tagsConnection) {
      return (
        <span>
          <Button onClick={() => tagsConnection.close()}>
            Close Connection
          </Button>
        </span>
      );
    }
    return null;
  }

  renderSelectedItem() {
    const { selectedItem } = this.state;
    if (Object.keys(selectedItem).length > 0) {
      return <Drawer>{selectedItem.name}</Drawer>;
    }
    return null;
  }

  render() {
    const { svgUrl } = this.state;
    const { locationId, floorId, api, show } = this.props;
    return (
      <div>
        <p>
          {this.renderTagsConnection()}
          {this.renderTagsStatus()}
        </p>
        {this.renderSelectedItem()}
        {/* TODO: Don't use inline styles */}
        <div style={{ position: "relative" }}>
          {this.renderZoomControls()}
          <svg
            ref={el => {
              this.mapSvg = el;
            }}
            className={cssMapSvg}
            onClick={this.onMapClick.bind(this)}
            viewBox="0 0 1700 2200"
          >
            <g id="svg_parent">
              <image
                width="1700"
                height="2200"
                xlinkHref={svgUrl}
                ref={el => {
                  this.mapImage = el;
                }}
              />
              <Tags
                locationId={locationId}
                floorId={floorId}
                api={api}
                markers={show.tags}
                onMarkerClick={this.onMarkerClick}
                onUpdate={this.onTagsUpdate}
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
