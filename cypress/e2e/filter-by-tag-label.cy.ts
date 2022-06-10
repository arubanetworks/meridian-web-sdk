import { getMeridianMap } from "./util/getMeridianMap";

describe("Filter by tag label", () => {
  it("should only show tag specified by the label through tags.filter", () => {
    cy.visit("/cypress/filter-by-tag-label");

    cy.get("[data-meridian-tag-id]").should("have.length", 1);
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("not.exist");

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        tags: { filter: () => true }
      });
    });

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("exist");
    cy.get('[data-meridian-tag-id="546C0E014866"]').should("exist");

    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        tags: {
          filter: assetTag =>
            assetTag.tags.some(
              (tagLabel: { name: string }) => tagLabel.name === "Multimeter"
            )
        }
      });
    });

    cy.get("[data-meridian-tag-id]").should("have.length", 1);
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("not.exist");
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("exist");
  });
});
