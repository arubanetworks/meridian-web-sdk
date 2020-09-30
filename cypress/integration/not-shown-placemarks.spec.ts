import { getMeridianMap } from "./util/getMeridianMap";

describe("Hidden Placemarks", () => {
  it("should not be shown unless showHiddenPlacemarks is true", () => {
    cy.visit("/cypress/basic");

    cy.get('[data-meridian-placemark-id="5766466041282560"]').should(
      "not.exist"
    );
    cy.get("[data-meridian-placemark-id]").should("have.length", 31);

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        placemarks: { showHiddenPlacemarks: true }
      });
    });

    cy.get('[data-meridian-placemark-id="5766466041282560"]').should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 32);
  });
});
