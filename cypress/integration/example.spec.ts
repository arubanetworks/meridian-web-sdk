describe("Example", () => {
  it("should work", () => {
    cy.visit("/");
    cy.get("#next").should("exist");
  });
});
