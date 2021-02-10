/* global $ */
/* global hljs */
/* global MeridianSDK */

import { fakeAPI } from "./cypress/utils/fake-api.js";

if (MeridianSDK) {
  if (document.documentElement.dataset.fakeApi !== "false") {
    // Enable live updates for demo usage
    fakeAPI._live = true;
    // This uses a regular function, not an arrow function, so that we can safely
    // use `new` with it.
    MeridianSDK.API = function() {
      return fakeAPI;
    };
  }
} else {
  // eslint-disable-next-line no-console
  console.error("Failed to monkey patch fakeAPI into MeridianSDK");
}

// Take code from a script tag and strip bad whitespace
function trimIndent(str) {
  const match = str.match(/^[ \t]*(?=\S)/gm);
  if (!match) {
    return str;
  }
  const lengths = match.map(x => x.length);
  const indent = Math.min(...lengths);
  const re = new RegExp(`^[ \\t]{${indent}}`, "gm");
  const s = indent > 0 ? str.replace(re, "") : str;
  return s.trim();
}

// Show the code dialog
function showTheCode() {
  $("#meridian-map").hide();
  const dialog = $("<div>").addClass("dialog flex flex-column");
  const heading = $("<div>")
    .addClass("flex flex-center section top-bar")
    .appendTo(dialog);
  $("<div>")
    .text(`Meridian SDK ${MeridianSDK.version}`)
    .addClass("heading flex-auto")
    .appendTo(heading);
  $("<button>")
    .text("Close")
    .addClass("close flex-0")
    .on("click", () => {
      dialog.remove();
      $("#meridian-map").show();
    })
    .appendTo(heading);
  const code = trimIndent($("#the-code").text());
  const html = hljs.highlight("javascript", code).value;
  $("<pre>")
    .html(html)
    .addClass("section")
    .appendTo(dialog);
  $("body").append(dialog);
}

// Add the toolbar to each page
function addToolbar() {
  const container = $("<div>").addClass("back");
  const back = $("<button>")
    .text("Back")
    .on("click", () => {
      window.location = "..";
    });
  const code = $("<button>")
    .text("Code")
    .on("click", showTheCode);
  container.append(back);
  if (window.location.pathname.indexOf("/docs/") === -1) {
    container.append($("<span>").addClass("separator")).append(code);
  }
  $("body").append(container);
}

addToolbar();
