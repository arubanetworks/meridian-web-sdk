function nthAnnotation(n: number) {
  return `[data-testid=meridian--private--annotation-point]:nth-child(${n})`;
}

function nthAnnotationTitle(n: number) {
  const parent = nthAnnotation(n);
  return `${parent} > [data-testid=meridian--private--annotation-point-title]`;
}

describe("Annotations: Point", () => {
  it("should render points", () => {
    cy.visit("/cypress/annotation-point");

    cy.get("[data-testid=meridian--private--annotation-layer]").should("exist");

    cy.get("[data-testid=meridian--private--annotation-point]").should(
      "have.length",
      1
    );
    cy.get(nthAnnotation(1))
      .should("have.css", "left", "0px")
      .should("have.css", "top", "0px");

    cy.get("[data-testid=meridian--private--annotation-point]").should(
      "have.length",
      8
    );
    cy.get(nthAnnotation(1))
      .should("have.css", "left", "100px")
      .should("have.css", "top", "100px");
    cy.get(nthAnnotation(2))
      .should("have.css", "left", "600px")
      .should("have.css", "top", "600px");
    cy.get(nthAnnotation(3))
      .should("have.css", "left", "700px")
      .should("have.css", "top", "700px");
    cy.get(nthAnnotation(4))
      .should("have.css", "left", "800px")
      .should("have.css", "top", "800px");
    cy.get(nthAnnotation(5))
      .should("have.css", "left", "2000px")
      .should("have.css", "top", "1200px");
    cy.get(nthAnnotationTitle(5))
      .contains("This is a very long title that should wrap")
      .should("exist");
    cy.get(nthAnnotation(6))
      .should("have.css", "left", "4000px")
      .should("have.css", "top", "1600px");
    cy.get(nthAnnotationTitle(6))
      .contains("Title")
      .should("exist");
    cy.get(nthAnnotation(7))
      .should("have.css", "left", "5000px")
      .should("have.css", "top", "1600px");
    cy.get(nthAnnotation(8))
      .should("have.css", "left", "6000px")
      .should("have.css", "top", "1600px");
  });
});
