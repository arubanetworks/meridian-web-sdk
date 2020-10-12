import { getMeridianMap } from "./util/getMeridianMap";

describe("Control Tags", () => {
  it("control tags should be hidden by default", () => {
    cy.visit("/cypress/basic");

    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get("[data-testid='meridian--private--floor-label']").should(
      "contain",
      "Main Building – Floor 01"
    );

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get('[data-meridian-tag-id="546C0E014517"]').should("not.exist");

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        tags: { showControlTags: true }
      });
    });

    cy.get('[data-meridian-tag-id="546C0E014517"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 4);
  });

  it("control tags should be visible", () => {
    cy.visit("/cypress/control-tags");

    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get("[data-testid='meridian--private--floor-label']").should(
      "contain",
      "Main Building – Floor 01"
    );

    cy.get('[data-meridian-tag-id="546C0E014517"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 4);

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        tags: { showControlTags: false }
      });
    });

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get('[data-meridian-tag-id="546C0E014517"]').should("not.exist");
  });
});
