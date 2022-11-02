import { getMeridianMap } from "./util/getMeridianMap";

describe("Overlays: Polygon", () => {
  it.skip("should render a polygon added thru .update", () => {
    cy.visit("/cypress/basic");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    getMeridianMap().then((meridianMap) => {
      meridianMap.update({
        overlays: [
          {
            type: "polygon",
            points: [400, 100, 800, 600, 100, 800],
            fill: "green",
            stroke: "red",
            strokeLineJoin: "round",
            strokeWidth: 4,
          },
        ],
      });
    });
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > polygon:only-child"
    )
      .should("have.attr", "points", "400 100 800 600 100 800")
      .should("have.attr", "fill", "green")
      .should("have.attr", "stroke", "red")
      .should("have.attr", "stroke-linejoin", "round");
    // We can't test strokeWidth because it's scaled by the zoom level, so the
    // values are kinda finicky for testing (i.e. if the zoom level changed
    // slightly, the stroke-width on the polygon would change.)
  });

  it.skip("should render a polygon from createMap, then render area placemarks", () => {
    cy.visit("/cypress/polygon");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > polygon:only-child"
    ).should("have.attr", "points", "400 100 800 600 100 800");
    cy.get("[data-testid=meridian--private--overlay-layer] > polygon").should(
      "have.length.above",
      1
    );
  });
});
