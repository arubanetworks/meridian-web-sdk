import { getMeridianMap } from "./util/getMeridianMap";

describe("Loading Tags (props.loadTags)", () => {
  it("should not load tags", () => {
    cy.visit("/cypress/load-tags");

    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get("[data-testid='meridian--private--floor-label']").should(
      "contain",
      "Main Building – Floor 01"
    );
    cy.get("[data-meridian-tag-id]").should("have.length", 0);

    getMeridianMap().then(meridianMap => {
      meridianMap.update({ loadTags: true });
    });

    cy.get("[data-meridian-tag-id]").should("have.length", 3);
  });
});
