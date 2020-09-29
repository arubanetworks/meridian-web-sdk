import { MeridianMap } from "../../src/web-sdk";

describe("Loading Placemarks (props.loadPlacemarks)", () => {
  it("should load placemarks by default", () => {
    cy.visit("/cypress/load-placemarks");

    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );
    cy.get("[data-meridian-placemark-id]").should("have.length", 31);

    cy.window().then((contentWindow: any) => {
      const meridianMap: MeridianMap = contentWindow.meridianMap;
      meridianMap.update({
        loadPlacemarks: false
      });
    });

    cy.get("[data-meridian-placemark-id]").should("have.length", 0);
  });
});
