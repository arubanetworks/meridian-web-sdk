import { getMeridianMap } from "./util/getMeridianMap";

describe("Filter by placemark types", () => {
  it("should filter placemarks based on type using placemarks.filter", () => {
    cy.visit("/cypress/basic");
    cy.get(".meridian-placemark-icon").should("have.length", 31);
    // Only show "cafe" placemarks
    getMeridianMap().then((meridianMap) => {
      meridianMap.update({
        placemarks: {
          filter: (p) => p.type === "cafe",
        },
      });
    });
    // Only one placemark exists, and it's a "cafe"
    cy.get(".meridian-placemark-icon")
      .should("have.length", 1)
      .should("have.class", "meridian-placemark-type-cafe");
    // Show all placemarks again
    getMeridianMap().then((meridianMap) => {
      meridianMap.update({
        placemarks: {
          filter: undefined,
        },
      });
    });
    cy.get(".meridian-placemark-icon").should("have.length", 31);
  });
});
