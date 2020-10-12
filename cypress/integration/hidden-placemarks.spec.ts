import { getMeridianMap } from "./util/getMeridianMap";

describe("Hidden Placemarks", () => {
  it("should not be shown unless showHiddenPlacemarks is true", () => {
    // hidden placemarks not visible by default
    cy.visit("/cypress/basic");

    cy.get("[data-meridian-placemark-id]").should("have.length", 31);
    cy.get('[data-meridian-placemark-id="5766466041282560"]').should(
      "not.exist"
    );

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        placemarks: { showHiddenPlacemarks: true }
      });
    });

    cy.get("[data-meridian-placemark-id]").should("have.length", 32);
    cy.get('[data-meridian-placemark-id="5766466041282560"]').should("exist");

    // hidden placemarks visible by default
    cy.visit("/cypress/hidden-placemarks");

    cy.get("[data-meridian-placemark-id]").should("have.length", 32);
    cy.get('[data-meridian-placemark-id="5766466041282560"]').should("exist");

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        placemarks: { showHiddenPlacemarks: false }
      });
    });

    cy.get("[data-meridian-placemark-id]").should("have.length", 31);
    cy.get('[data-meridian-placemark-id="5766466041282560"]').should(
      "not.exist"
    );
  });
});
