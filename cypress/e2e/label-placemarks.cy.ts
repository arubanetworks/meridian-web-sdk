describe("Placemark Label Mode", () => {
  it("should have 3 Label Placemarks", () => {
    cy.visit("/full-page");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get("[data-testid='meridian--private--floor-label']").should(
      "contain",
      "Main Building – Floor 01"
    );
    cy.get(".meridian-label-only").should("have.length", 3);
  });
});
