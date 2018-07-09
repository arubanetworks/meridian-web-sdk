/* global $ */
/* global hljs */
/* global Stats */
/* global MeridianSDK */

$(function() {
  // Take code from a script tag and strip bad whitespace
  function trimIndent(str) {
    var match = str.match(/^[ \t]*(?=\S)/gm);
    if (!match) {
      return str;
    }
    var lengths = match.map(function(x) {
      return x.length;
    });
    var indent = Math.min.apply(Math, lengths);
    var re = new RegExp("^[ \\t]{" + indent + "}", "gm");
    var s = indent > 0 ? str.replace(re, "") : str;
    return s.trim();
  }

  // Show the performance monitor on screen
  function showPerf() {
    var script = document.createElement("script");
    script.onload = function() {
      var stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };
    script.src = "//rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
    document.head.appendChild(script);
  }

  // Show the code dialog
  function showTheCode() {
    var dialog = $("<div>").addClass("dialog flex flex-column");
    var heading = $("<div>")
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
    var code = trimIndent($("#the-code").text());
    var html = hljs.highlight("javascript", code).value;
    $("<pre>")
      .html(html)
      .addClass("section")
      .appendTo(dialog);
    $("body").append(dialog);
  }

  // Add the toolbar to each page
  function addToolbar() {
    var container = $("<div>").addClass("back");
    var back = $("<button>")
      .text("Back")
      .on("click", function() {
        window.location = "..";
      });
    var code = $("<button>")
      .text("Code")
      .on("click", showTheCode);
    var perf = $("<button>")
      .text("Perf")
      .on("click", showPerf);
    container
      .append(back)
      .append($("<span>").addClass("separator"))
      .append(code)
      .append($("<span>").addClass("separator"))
      .append(perf);
    $("body").append(container);
  }

  addToolbar();
});
