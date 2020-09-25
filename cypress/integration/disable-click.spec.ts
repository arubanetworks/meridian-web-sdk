describe("Disable click", () => {
  it("not allow clicking placemarks or tags based on a boolean", () => {
    cy.visit("/cypress/disable-click");
    // Test all tags and placemarks
    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get("[data-meridian-placemark-id]").should("have.length", 31);
    cy.get("[data-meridian-tag-id]").should("be.disabled");
    cy.get("[data-meridian-placemark-id]").should("be.disabled");
  });
});
