(function() {
  function showTheCode() {
    var element = document.getElementById("the-code");
    // TODO
  }

  function main() {
    // Container
    var container = document.createElement("div");
    container.className = "back";
    // Back button
    var back = document.createElement("a");
    back.href = "../index.html";
    back.innerHTML = "&larr; Back";
    // Separator
    var separator = document.createElement("span");
    separator.className = "separator";
    // Show the code button
    var code = document.createElement("a");
    code.innerHTML = "Show code";
    code.href = "javascript:;";
    code.onclick = function() {
      showTheCode();
    };
    // Mount in the DOM
    container.appendChild(back);
    container.appendChild(separator);
    container.appendChild(code);
    document.body.appendChild(container);
  }

  document.addEventListener("DOMContentLoaded", main, false);
})();
