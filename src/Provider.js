import { h, Component } from "preact";
import PropTypes from "prop-types";

export default class Provider extends Component {
  static propTypes = {
    component: PropTypes.any.isRequired,
    context: PropTypes.object.isRequired
  };

  state = {
    options: null
  };

  render() {
    const { options } = this.state;
    const { context, component: Component } = this.props;
    if (Component && context && options) {
      return <Component api={context.api} {...options} />;
    }
    return <div />;
  }
}
