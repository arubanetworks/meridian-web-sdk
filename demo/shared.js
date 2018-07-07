/* global $ */
/* global hljs */
/* global Stats */
/* global MeridianSDK */

$(function() {
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
  function showTheCode() {
    function remove() {
      dialog.remove();
    }
    var dialog = $("<div>").addClass("dialog flex flex-column");
    var heading = $("<div>")
      .addClass("flex flex-center section")
      .appendTo(dialog);
    $("<div>")
      .text("Meridian SDK " + MeridianSDK.version)
      .addClass("heading flex-auto")
      .appendTo(heading);
    $("<button>")
      .text("Close")
      .addClass("close flex-0")
      .on("click", remove)
      .appendTo(heading);
    var code = $("#the-code").text();
    var html = hljs.highlight("javascript", code).value;
    $("<pre>")
      .html(html)
      .addClass("section")
      .appendTo(dialog);
    $("body").append(dialog);
  }
  var container = $("<div>").addClass("back");
  var back = $("<button>")
    .text("Back")
    .on("click", function() {
      window.location = "../index.html";
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
});
