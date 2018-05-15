import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: "meridian-textbox",
  styleUrl: "textbox.css",
  shadow: true
})
export class MeridianButton {
  @Prop() value: string = "";
  @Prop() onUpdate: (value: string) => void = () => {};

  render() {
    return (
      <input
        type="text"
        value={this.value}
        onInput={event => {
          const { target } = event as any;
          this.onUpdate(target.value);
        }}
      />
    );
  }
}
