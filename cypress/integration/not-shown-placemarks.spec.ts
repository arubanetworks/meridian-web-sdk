import { MeridianMap } from "../../src/web-sdk";

function getMeridianMap(): Cypress.Chainable<MeridianMap> {
  return cy.window().then(contentWindow => {
    return (contentWindow as any).meridianMap;
  });
}

describe("placemarks not shown by default", () => {
  it("should ensure that placemarks not shown by default exist but aren't shown", () => {
    cy.visit("/cypress/not-shown-placemarks");

    cy.get('[data-meridian-placemark-id="5766466041282560"]').should(
      "not.exist"
    );

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        placemarks: {
          filter: placemark => placemark.hide_on_map === true
        }
      });
    });

    cy.get("[data-meridian-placemark-id]").should("have.length", 0);
  });
});
