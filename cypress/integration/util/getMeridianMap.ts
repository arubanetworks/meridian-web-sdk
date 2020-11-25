import { MeridianMapElement } from "../../../src/web-sdk";

// I'm not sure why, but Cypress is automatically "upgrading" raw DOM elements
// into jQuery element collections, perhaps as part of the Cypress.Chainable
// interface... "Neato".
export function getMeridianMap(): Cypress.Chainable<
  JQuery<MeridianMapElement>
> {
  // I've tried so many ways to augment this "window" object with a
  // `meridianMap` property, but no matter what I do it won't work. So here we
  // override the type to `any` so that we can access the global variable.
  return cy.window().then((contentWindow: any) => {
    const elem = contentWindow.document.querySelector("meridian-map");
    if (!elem) {
      throw new Error("couldn't find <meridian-map>");
    }
    return elem;
  });
}
