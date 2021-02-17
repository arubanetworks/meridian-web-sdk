import { getMeridianMap } from "./util/getMeridianMap";

describe("Overlays: Polyline", () => {
  it("should render a polyline added thru .update", () => {
    cy.visit("/cypress/basic");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    getMeridianMap().then(meridianMap => {
      meridianMap.update({
        overlays: [
          {
            type: "polyline",
            points: [
              100,
              100,
              200,
              300,
              400,
              400,
              500,
              900,
              700,
              1950,
              1000,
              2200
            ],
            stroke: "red",
            strokeLineJoin: "round",
            strokeWidth: 4
          }
        ]
      });
    });
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > polyline:only-child"
    )
      .should(
        "have.attr",
        "points",
        "100 100 200 300 400 400 500 900 700 1950 1000 2200"
      )
      .should("have.attr", "fill", "none")
      .should("have.attr", "stroke", "red")
      .should("have.attr", "stroke-linejoin", "round");
    // We can't test strokeWidth because it's scaled by the zoom level, so the
    // values are kinda finicky for testing (i.e. if the zoom level changed
    // slightly, the stroke-width on the path would change.)
  });

  it("should render a polyline that connects every placemark", () => {
    cy.visit("/cypress/polyline");
    cy.get("[data-testid='meridian--private--map-container']").should("exist");
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > polyline:only-child"
    ).should("have.attr", "points", "0 100 1000 2000");
    cy.get(
      "[data-testid=meridian--private--overlay-layer] > polyline:only-child"
    ).should(
      "have.attr",
      "points",
      "4670.1357421875 299.36767578125 6825.5830078125 478.98833499103785 5272.39306640625 648.04296875 5687.98583984375 767.7900390625 4465.861328125 887.537109375 5599.9365234375 950.9326171875 6846.71484375 1225.646484375 6029.6171875 1320.73974609375 3204.9951171875 1465.140625 4353.158203125 1690.546875 6867.8466796875 1739.8544921875 1922.9970703125 1866.6455078125 4902.5859375 1951.1728515625 5399.18408203125 2021.6123046875 5867.6064453125 2025.1342672673054 6867.8466796875 2077.9638671875 4902.5859375 2183.623046875 5022.3330078125 2567.51806640625 4469.38330078125 2750.66064453125 3740.3349609375 2754.1826171875 2100.856689453125 2842.23193359375 5025.85498046875 2976.06689453125 3163.514022305608 3162.7314016479068 3103.053554404527 3423.357421875 3768.5107421875 3645.24169921875 5749.620361328125 3786.12060546875 3092.2919921875 3789.642578125 6818.5390625 3838.9501953125 5282.958984375 3853.0380859375 6177.5400390625 3853.0380859375 4677.1796875 3853.0380859375"
    );
  });
});
