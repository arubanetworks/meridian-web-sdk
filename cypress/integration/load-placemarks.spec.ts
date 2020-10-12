import { getMeridianMap } from "./util/getMeridianMap";

describe("Loading Placemarks (props.loadPlacemarks)", () => {
  it("should not load placemarks", () => {
    cy.visit("/cypress/load-placemarks");

    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get("[data-testid='meridian--private--floor-label']").should(
      "contain",
      "Main Building – Floor 01"
    );
    cy.get("[data-meridian-placemark-id]").should("have.length", 0);

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        loadPlacemarks: true
      });
    });

    cy.get("[data-meridian-placemark-id]").should("have.length", 31);
  });
});
