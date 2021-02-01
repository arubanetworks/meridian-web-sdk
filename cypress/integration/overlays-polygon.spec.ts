import { getMeridianMap } from "./util/getMeridianMap";

describe("Overlays: Polygon", () => {
  it("should render a polygon added thru .update", () => {
    cy.visit("/cypress/basic");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    getMeridianMap().then(map => {
      map.update({
        overlays: [
          {
            type: "polygon",
            points: [400, 100, 800, 600, 100, 800]
          }
        ]
      });
    });
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > path:only-child"
    ).should("have.attr", "d", "M400,100 L800,600 L100,800 Z");
  });

  it("should render a polygon from createMap, then render area placemarks", () => {
    cy.visit("/cypress/polygon");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > path:only-child"
    ).should("have.attr", "d", "M400,100 L800,600 L100,800 Z");
    cy.get("[data-testid=meridian--private--overlay-layer] > path").should(
      "have.length.above",
      1
    );
  });
});
