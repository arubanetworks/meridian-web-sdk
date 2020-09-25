describe("Disable click", () => {
  it("should not allow clicking placemarks or tags based on a boolean", () => {
    cy.visit("/cypress/disable-click");
    cy.get(".meridian-map-container").should("exist");
    // Test all tags and placemarks
    cy.get("[data-meridian-tag-id]").should("be.disabled");
    cy.get("[data-meridian-placemark-id]").should("be.disabled");
  });
});
