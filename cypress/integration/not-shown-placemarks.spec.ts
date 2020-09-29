import { MeridianMap } from "../../src/web-sdk";

function getMeridianMap(): Cypress.Chainable<MeridianMap> {
  return cy.window().then(contentWindow => {
    return (contentWindow as any).meridianMap;
  });
}

describe("Hidden Placemarks", () => {
  it("should not be shown unless showHiddenPlacemarks is true", () => {
    cy.visit("/cypress/basic");

    cy.get('[data-meridian-placemark-id="5766466041282560"]').should(
      "not.exist"
    );

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        placemarks: { showHiddenPlacemarks: true }
      });
    });

    cy.get('[data-meridian-placemark-id="5766466041282560"]').should(
      "not.exist"
    );
  });
});
