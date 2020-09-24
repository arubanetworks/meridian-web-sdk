describe("Example", () => {
  it("should work", () => {
    cy.visit("/cypress/basic");
    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get('[data-meridian-placemark-id="5653164804014080"]').should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 31);
  });
});
