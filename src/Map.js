import { h, Component } from "preact";
import _ from "lodash";

const { MeridianWebApi } = global;
const seconds = s => s * 1000;

export default class Map extends Component {
  render() {
    const { name } = this.props;
    return <div>I am a map named: {name}</div>;
  }
}
