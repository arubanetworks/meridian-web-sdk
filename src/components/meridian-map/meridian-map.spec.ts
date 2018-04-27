import { flush, render } from "@stencil/core/testing";
import { MeridianMap } from "./meridian-map";

describe("meridian-map", () => {
  it("should build", () => {
    expect(new MeridianMap()).toBeTruthy();
  });

  describe("rendering", () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [MeridianMap],
        html: "<meridian-map></meridian-map>"
      });
    });

    it("should work without parameters", () => {
      expect(element.textContent.trim()).toEqual("Hello, World! I'm");
    });

    it("should work with a first name", async () => {
      element.first = "Peter";
      await flush(element);
      expect(element.textContent.trim()).toEqual("Hello, World! I'm Peter");
    });

    it("should work with a last name", async () => {
      element.last = "Parker";
      await flush(element);
      expect(element.textContent.trim()).toEqual("Hello, World! I'm  Parker");
    });

    it("should work with both a first and a last name", async () => {
      element.first = "Peter";
      element.last = "Parker";
      await flush(element);
      expect(element.textContent.trim()).toEqual(
        "Hello, World! I'm Peter Parker"
      );
    });
  });
});
