describe("Example", () => {
  it("should work", () => {
    cy.visit("/cypress/example");
    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should("contain", "Aruba HQ – Floor 01");
    cy.get('[data-meridian-tag-id="A0E6F83810BB"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 2);
    cy.get('[data-meridian-placemark-id="5653164804014080"]').should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 31);
  });
});
