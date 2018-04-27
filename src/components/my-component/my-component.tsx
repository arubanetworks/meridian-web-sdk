import _ from "lodash";
import { Component, Prop } from "@stencil/core";

@Component({
  tag: "my-component",
  styleUrl: "my-component.css",
  shadow: true
})
export class MyComponent {
  @Prop() first: string;
  @Prop() last: string;

  render() {
    return (
      <div>
        Hello, World!
        <div>
          I'm {_.lowerCase(this.first)} {this.last}
        </div>
      </div>
    );
  }
}
