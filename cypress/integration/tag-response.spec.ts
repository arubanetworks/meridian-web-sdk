describe("Tag Response", () => {
  it.skip("visits the webSDK basic example page and select the existing tag", () => {
    cy.visit(
      "https://arubanetworks.github.io/meridian-web-sdk/examples/basic/"
    );

    cy.server();
    cy.route("POST", "**/api/v1/track/assets").as("asset-response");

    cy.wait("@asset-response").should((postXHR: any) => {
      expect(postXHR, "POST response").to.have.property("status", 200);
      expect(postXHR.response.body, "POST response body").to.have.property(
        "asset_updates"
      );
      const updates = postXHR.response.body.asset_updates;
      expect(updates[0], "POST response first asset").to.include.keys(
        "id",
        "mac",
        "location_id",
        "map_id",
        "x",
        "y"
      );
    });
  });
});
