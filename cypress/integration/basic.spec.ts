describe("Basic", () => {
  before(() => {
    cy.visit("/cypress/basic");
  });

  it("should render map and UI elements", () => {
    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );
    cy.get(".meridian-tag-control").should("exist");
    cy.get(".meridian-floor-control").should("exist");

    cy.get(".meridian-zoom-button-in").should("exist");
    cy.get(".meridian-zoom-button-out").should("exist");

    // no overlays should exist
    cy.get(".meridian-map-overlay").should("not.exist");
  });

  it("should show placemarks and tags", () => {
    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );

    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("exist");
    cy.get("[data-meridian-tag-id]")
      .should("have.length", 3)
      .should("not.be.disabled");

    // second floor tag should not be visible
    cy.get('[data-meridian-tag-id="546C0E014877"]').should("not.exist");

    cy.get('[data-meridian-placemark-id="5653164804014080"]').should("exist");
    cy.get("[data-meridian-placemark-id]")
      .should("have.length", 31)
      .should("not.be.disabled");

    // second floor placemark should not be visible
    cy.get('[data-meridian-placemark-id="5086441721823232"]').should(
      "not.exist"
    );
  });

  it("should not show control tags", () => {
    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    // control tag
    cy.get('[data-meridian-tag-id="546C0E014517"]').should("not.exist");
  });

  it("Should have floor a selection UI that provides filtering and indicates the current floor", () => {
    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );

    // open the floor list/selection overlay
    cy.get(".meridian-floor-control").click();
    cy.get("button.current-floor").within(() => {
      cy.contains("Floor 01");
      cy.get("svg").should("exist");
    });

    cy.get("input.search").type("Floor 02");
    cy.get(".floors-list").within(() => {
      cy.get("button.current-floor").should("not.exist");
      cy.contains("Floor 01").should("not.exist");
      cy.contains("Floor 02");
    });

    cy.get("input.search").clear();
    cy.get(".floors-list").within(() => {
      cy.contains("Floor 01");
      cy.contains("Floor 02");
      cy.get("button.current-floor").should("contain", "Floor 01");
    });

    // close the floor overlay
    cy.get("button.close").click();
    // flooor overlay should not be visible
    cy.get(".meridian-map-overlay.floors").should("not.exist");
  });

  it("Should have floor selection UI that allows changing floors", () => {
    cy.get(".meridian-map-container").should("exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 01"
    );

    cy.get(".meridian-floor-control").click();
    cy.get("button")
      .contains("Floor 02")
      .click();

    // overlay should not be visible
    cy.get(".meridian-map-overlay.floors").should("not.exist");
    cy.get(".meridian-floor-label").should(
      "contain",
      "Main Building – Floor 02"
    );

    cy.get('[data-meridian-placemark-id="5086441721823232"]').should("exist");
    cy.get("[data-meridian-placemark-id]")
      .should("have.length", 10)
      .should("not.be.disabled");

    // First floor placemark should not be visible
    cy.get('[data-meridian-placemark-id="5631943370604544"]').should(
      "not.exist"
    );

    cy.get("[data-meridian-tag-id]")
      .should("have.length", 2)
      .should("not.be.disabled");
    cy.get('[data-meridian-tag-id="546C0E014877"]').should("exist");
    cy.get('[data-meridian-tag-id="546C0E032A98"]').should("exist");

    // control tags should not visible
    cy.get('[data-meridian-tag-id="546C0E014528"]').should("not.exist");

    // First floor tag should not be visible
    cy.get('[data-meridian-tag-id="546C0E082AFB"]').should("not.exist");
  });
});
