/* global $ */
/* global hljs */
/* global Stats */
/* global MeridianSDK */

$(function() {
  // Take code from a script tag and strip bad whitespace
  function trimIndent(str) {
    const match = str.match(/^[ \t]*(?=\S)/gm);
    if (!match) {
      return str;
    }
    const lengths = match.map(function(x) {
      return x.length;
    });
    const indent = Math.min(...lengths);
    const re = new RegExp("^[ \\t]{" + indent + "}", "gm");
    const s = indent > 0 ? str.replace(re, "") : str;
    return s.trim();
  }

  // Show the performance monitor on screen
  let stats;
  function initPerf() {
    const url = "https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
    $.getScript(url, function() {
      stats = new Stats();
      $(document.body).append(stats.dom);
      requestAnimationFrame(function perfLoop() {
        stats.update();
        requestAnimationFrame(perfLoop);
      });
    });
  }

  function togglePerf() {
    if (stats) {
      $(stats.dom).toggle();
    } else {
      initPerf();
    }
  }

  function hidePerf() {
    if (stats) {
      $(stats.dom).hide();
    }
  }

  // Show the code dialog
  function showTheCode() {
    hidePerf();
    const dialog = $("<div>").addClass("dialog flex flex-column");
    const heading = $("<div>")
      .addClass("flex flex-center section top-bar")
      .appendTo(dialog);
    $("<div>")
      .text("Meridian SDK " + MeridianSDK.version)
      .addClass("heading flex-auto")
      .appendTo(heading);
    $("<button>")
      .text("Close")
      .addClass("close flex-0")
      .on("click", function() {
        dialog.remove();
      })
      .appendTo(heading);
    const elem = $("meridian-map")[0] || $("#meridian-map")[0];
    const props = [];
    for (const attr of elem.getAttributeNames()) {
      props.push(`  ${attr}=${JSON.stringify(elem.getAttribute(attr))}`);
    }
    const $code = $("#the-code");
    const scriptInner = trimIndent($code.text());
    const codeTag = $code.get(0).nodeName.toLowerCase();
    const script = scriptInner
      ? `\n\n<${codeTag}>\n${scriptInner}\n</${codeTag}>`
      : "";
    const tag = elem.nodeName.toLowerCase();
    const code = `\
<${tag}
${props.join("\n")}
></${tag}>
${script}
`;
    const html = hljs.highlight("html", code).value;
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
      .on("click", function() {
        window.location = "..";
      });
    const code = $("<button>")
      .text("Code")
      .on("click", showTheCode);
    const perf = $("<button>")
      .text("Perf")
      .on("click", togglePerf);
    container.append(back);
    if (window.location.pathname.indexOf("/docs/") === -1) {
      container
        .append($("<span>").addClass("separator"))
        .append(code)
        .append($("<span>").addClass("separator"))
        .append(perf);
    }
    $("body").append(container);
  }

  addToolbar();
});
