/* global $ */
/* global hljs */

$(function() {
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
  var separator = $("<span>").addClass("separator");
  var code = $("<button>")
    .text("Code")
    .on("click", showTheCode);
  container
    .append(back)
    .append(separator)
    .append(code);
  $("body").append(container);
});
