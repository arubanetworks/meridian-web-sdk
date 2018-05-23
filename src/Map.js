import { h, Component } from "preact";

export default class Map extends Component {
  render() {
    const { name } = this.props;
    return <div>I'm a map named {name}</div>;
  }
}
