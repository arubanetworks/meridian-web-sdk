import { getMeridianMap } from "./util/getMeridianMap";

describe("Filter update", () => {
  it("should only show data specified by tags.filter and placemarks.filter", () => {
    cy.visit("/cypress/filter-update");

    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get("[data-meridian-placemark-id='5717271485874176']").should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 35);

    getMeridianMap().then((meridianMap) => {
      meridianMap.update({
        tags: {
          filter: (tag) => tag.name === "Jamboard - Blue",
        },
        placemarks: {
          filter: (placemark) => placemark.name === "Coffee Bar",
        },
      });
    });

    cy.get("[data-meridian-tag-id='546C0E032A87']").should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 1);
    cy.get("[data-meridian-placemark-id='5717271485874176']").should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 1);

    getMeridianMap().then((meridianMap) => {
      meridianMap.update({
        tags: {},
        placemarks: {},
      });
    });

    cy.get("[data-meridian-tag-id='546C0E032A87']").should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get("[data-meridian-placemark-id='5717271485874176']").should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 35);
  });
});
