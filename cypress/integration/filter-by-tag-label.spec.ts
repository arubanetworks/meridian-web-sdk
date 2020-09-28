import { MeridianMap } from "../../src/web-sdk";

describe("Filter by tag label", () => {
  it("should only show tag specified by the label through tags.filter", () => {
    cy.visit("/cypress/filter-by-tag-label");

    cy.get("[data-meridian-tag-id]").should("have.length", 1);
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("not.exist");

    cy.window().then((contentWindow: any) => {
      const meridianMap: MeridianMap = contentWindow.meridianMap;
      meridianMap.update({
        tags: { filter: () => true }
      });
    });

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("exist");
    cy.get('[data-meridian-tag-id="546C0E014866"]').should("exist");

    cy.window().then((contentWindow: any) => {
      const meridianMap: MeridianMap = contentWindow.meridianMap;
      meridianMap.update({
        tags: {
          filter: tag =>
            tag.tags.some((tag: { name: string }) => tag.name === "Multimeter")
        }
      });
    });

    cy.get("[data-meridian-tag-id]").should("have.length", 1);
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("not.exist");
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("exist");
  });
});
