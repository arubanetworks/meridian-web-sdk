describe("Basic/Default test", () => {
  it("should render map and UI elements", () => {
    cy.visit("/cypress/basic");

    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );
    cy.get(".meridian-tag-control").should("exist");
    cy.get(".meridian-floor-control").should("exist");

    cy.get(".meridian-zoom-button-in").should("exist");
    cy.get(".meridian-zoom-button-out").should("exist");
  });

  it("should load placemark and tag data", () => {
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

  it("should not show control tags", () => {
    cy.visit("/cypress/basic");

    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );

    // control tags are not shown
    cy.get('[data-meridian-tag-id="546C0E014517"]').should("not.exist");
  });
});
