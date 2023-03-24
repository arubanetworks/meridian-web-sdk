describe("Lat/Lng to Map Point", () => {
  it("should render an annotation point named test by lat/lng", () => {
    cy.visit("/cypress/lat-lng-to-map-point");

    cy.get("[data-testid=meridian--private--annotation-layer]").should("exist");
    cy.get("[data-testid=meridian--private--annotation-point]")
      .contains("test")
      .should("exist");
  });
  it("should render a polygon created by lat/lng points", () => {
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > polygon:only-child"
    )
      .should(
        "have.attr",
        "points",
        "2676.3496684757583,3981.5584417855234 863.8948290507998,3826.4073142284496 934.9714894979141,2927.8229486145065 2676.3496684757583,3735.902471996899"
      )
      .should("have.attr", "stroke", "hsl(207, 65%, 46%)");
  });
});
