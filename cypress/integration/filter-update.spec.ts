import { MeridianMap } from "../../src/web-sdk";

describe("Filter update", () => {
  it("should only show data specified by tags.filter and placemarks.filter", () => {
    // We don't have any way to know when the Web SDK is done updating, so we
    // just need to sleep briefly. Otherwise we'll run both `meridianMap.update`
    // calls before any of the Cypress assertions fire, causing most of them to
    // fail.
    const sleep = 100;
    cy.visit("/cypress/filter-update");
    cy.get('[data-meridian-tag-id="546C0E032A87"]').should("exist");
    cy.get("[data-meridian-tag-id]").should("have.length", 3);
    cy.get("[data-meridian-placemark-id='5717271485874176']").should("exist");
    cy.get("[data-meridian-placemark-id]").should("have.length", 32);
    cy.window().then(contentWindow => {
      // Having a hard time figuring out how to add `meridianMap` as a property
      // of the window here, so just faking it with `as any` :shrug:
      const meridianMap: MeridianMap = (contentWindow as any).meridianMap;
      meridianMap.update({
        tags: {
          filter: tag => tag.name === "Jamboard - Blue"
        },
        placemarks: {
          filter: placemark => placemark.name === "Coffee Bar"
        }
      });
      cy.wait(sleep).then(() => {
        cy.get("[data-meridian-tag-id='546C0E032A87']").should("exist");
        cy.get("[data-meridian-tag-id]").should("have.length", 1);
        cy.get("[data-meridian-placemark-id='5717271485874176']").should(
          "exist"
        );
        cy.get("[data-meridian-placemark-id]").should("have.length", 1);
        cy.wait(sleep).then(() => {
          meridianMap.update({
            tags: {},
            placemarks: {}
          });
          cy.get("[data-meridian-tag-id='546C0E032A87']").should("exist");
          cy.get("[data-meridian-tag-id]").should("have.length", 3);
          cy.get("[data-meridian-placemark-id='5717271485874176']").should(
            "exist"
          );
          cy.get("[data-meridian-placemark-id]").should("have.length", 32);
        });
      });
    });
  });
});
