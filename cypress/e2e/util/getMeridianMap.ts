import { MeridianMap } from "../../../src/web-sdk";

export function getMeridianMap(): Cypress.Chainable<MeridianMap> {
  // I've tried so many ways to augment this "window" object with a
  // `meridianMap` property, but no matter what I do it won't work. So here we
  // override the type to `any` so that we can access the global variable.
  return cy.window().then((contentWindow: any) => {
    return contentWindow.meridianMap;
  });
}
