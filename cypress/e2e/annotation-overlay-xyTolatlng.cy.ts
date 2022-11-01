describe("Overlay: Point & Polygon by XY converted to Lat/Lng", () => {
  it("should render an annotation point named test by  taking an xy then converting to lat/lng", () => {
    cy.visit("/cypress/annotation-point-xy");

    cy.get("[data-testid=meridian--private--annotation-layer]").should("exist");
    cy.get("[data-testid=meridian--private--annotation-point]")
      .contains("test")
      .should("exist");
  });
  it("should log the Lat/Lng converted from xy", () => {
    cy.visit("/cypress/annotation-point-xy", {
      onBeforeLoad(win) {
        cy.stub(win.console, "log").as("consoleLog");
      },
    });
    cy.get("@consoleLog").should("be.calledWith", {
      lat: 37.38215380256578,
      lng: -121.9815922111018,
    });
  });
});
