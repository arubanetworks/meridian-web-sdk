describe("Filter by tag label", () => {
  it("should only show tag specified by the label through tags.filter", () => {
    cy.visit("/cypress/filter-by-tag-label");
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 1);
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("not.exist");
  });
});
