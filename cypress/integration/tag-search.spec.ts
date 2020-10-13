describe("Tag Search", () => {
  it("should filter the tag list when searching, and select a tag when clicking", () => {
    cy.visit("/cypress/tag-search");
    // Open tags list
    cy.get("[data-testid=meridian--private--tag-control]").click();
    // Search for "Jamboard"
    cy.get("[data-testid=meridian--private--overlay-search]").type("Jamboard");
    // Assert both "Jamboard" results are shown, and nothing else
    cy.get("[data-testid=meridian--private--overlay-tag-546C0E032A87]").should(
      "exist"
    );
    cy.get("[data-testid=meridian--private--overlay-tag-546C0E032A98]").should(
      "exist"
    );
    cy.get("[data-testid^=meridian--private--overlay-tag-]").should(
      "have.length",
      2
    );
    // Close overlay
    cy.get("[data-testid=meridian--private--close-overlay]").click();
    // Open tags list
    cy.get("[data-testid=meridian--private--tag-control]").click();
    // Search for "Chad"
    cy.get("[data-testid=meridian--private--overlay-search]").type("Chad");
    // Click "Chad"
    cy.get("[data-testid=meridian--private--overlay-tag-546C0E014866]").click();
    // Assert data in the information popup for "Chad"
    cy.get("[data-testid=meridian--private--map-overlay")
      .should("contain", "Chad")
      .should("contain", "CT-Human")
      .should("contain", "546C0E014866");
    // Close overlay
    cy.get("[data-testid=meridian--private--close-overlay]").click();
  });
});
