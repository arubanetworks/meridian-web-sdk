/* global $ */
/* global hljs */
/* global Stats */

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
    var close1 = $("<button>")
      .text("Close")
      .addClass("close")
      .on("click", remove);
    var close2 = $("<button>")
      .text("Close")
      .addClass("close")
      .on("click", remove);
    var code = $("#the-code").text();
    var html = hljs.highlight("javascript", code).value;
    var dialog = $("<div>").addClass("dialog");
    var pre = $("<pre>").html(html);
    dialog.append(close1);
    dialog.append(pre);
    dialog.append(close2);
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
