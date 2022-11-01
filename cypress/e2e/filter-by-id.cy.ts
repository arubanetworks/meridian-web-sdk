describe("Filter by ID", () => {
  it("should only show data specified by tags.filter and placemarks.filter", () => {
    cy.visit("/cypress/filter-by-id");
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 1);
    cy.get('[data-meridian-placemark-id="5717271485874176"]').should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 1);
  });
});
