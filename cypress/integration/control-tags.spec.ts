import { MeridianMap } from "../../src/web-sdk";

describe("Control Tags", () => {
  it("control tags should be hidden by default", () => {
    cy.visit("/cypress/basic");

    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get('[data-meridian-tag-id="546C0E014517"]').should("not.exist");

    cy.window().then((contentWindow: any) => {
      const meridianMap: MeridianMap = contentWindow.meridianMap;
      meridianMap.update({
        tags: { showControlTags: true }
      });
    });

    cy.get('[data-meridian-tag-id="546C0E014517"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 4);
  });

  it("control tags should be hidden by default", () => {
    cy.visit("/cypress/control-tags");

    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );

    cy.get('[data-meridian-tag-id="546C0E014517"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 4);

    cy.window().then((contentWindow: any) => {
      const meridianMap: MeridianMap = contentWindow.meridianMap;
      meridianMap.update({
        tags: { showControlTags: false }
      });
    });

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get('[data-meridian-tag-id="546C0E014517"]').should("not.exist");
  });
});
