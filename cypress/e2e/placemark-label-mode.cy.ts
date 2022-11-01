import { getMeridianMap } from "./util/getMeridianMap";

describe("Placemark Label Mode", () => {
  it("should work for all label modes", () => {
    cy.visit("/full-page");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get("[data-testid='meridian--private--floor-label']").should(
      "contain",
      "Main Building – Floor 01"
    );

    // ---[ always ]---
    getMeridianMap().then((meridianMap) => {
      meridianMap.update({ placemarks: { labelMode: "always" } });
    });
    cy.get(".meridian-label").should("have.length", 34).should("be.visible");

    // ---[ never ]---
    getMeridianMap().then((meridianMap) => {
      meridianMap.update({ placemarks: { labelMode: "never" } });
    });
    cy.get(".meridian-label")
      .should("have.length", 34)
      .should("not.be.visible");

    // ---[ hover ]---
    getMeridianMap().then((meridianMap) => {
      meridianMap.update({ placemarks: { labelMode: "hover" } });
    });
    // We can't actually simulate `:hover` CSS with Cypress, so this is the best
    // test we can write.
    cy.get(".meridian-label")
      .should("have.length", 34)
      .should("not.be.visible");
    cy.get("[data-meridian-placemark-label-mode='hover']").should(
      "have.length",
      31
    );

    // ---[ zoom ]---
    getMeridianMap().then((meridianMap) => {
      meridianMap.update({ placemarks: { labelMode: "zoom" } });
      meridianMap.zoomToPoint({ x: 2000, y: 2000, scale: 2 });
    });
    cy.get("[data-meridian-placemark-label-zoom-visible='true']").should(
      "have.length",
      34
    );
  });
});
