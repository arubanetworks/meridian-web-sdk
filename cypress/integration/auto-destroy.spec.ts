import { getMeridianMap } from "./util/getMeridianMap";

describe("Auto-Destroy", () => {
  before(() => {
    cy.visit("/cypress/basic");
  });

  it("should automatically destroy itself after having the map container removed", () => {
    const onDestroyStub = cy.stub();
    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        onDestroy: onDestroyStub
      });
    });
    cy.window().then(win => {
      const mapContainer = win.document.querySelector("#meridian-map");
      if (!mapContainer) {
        throw new Error("no map container");
      }
      if (!mapContainer.parentElement) {
        throw new Error("no map container parent");
      }
      mapContainer.parentElement.removeChild(mapContainer);
    });
    cy.get("#meridian-map").should("not.exist");
    cy.wait(2000);
    getMeridianMap().then(meridianMap => {
      expect(onDestroyStub).to.have.callCount(1);
      expect(meridianMap.isDestroyed).to.equal(true);
    });
  });
});
