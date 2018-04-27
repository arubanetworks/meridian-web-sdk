* Use CSS variables <https://stenciljs.com/docs/styling>
* Stencil JS does not manage PNG, JPEG, SVG, etc assets for you
  * Probably want to make our own SVG atlas and use `<use>` inside our icon
    component in order to render those things out on the page
  * We could write an npm script that assembles the SVGs into an SVG atlas for
    us and just have a little bit of code that determines whether or not we load
    from a Google Cloud Storage URL or our hardcoded localhost path
