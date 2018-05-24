* How do developers want to specify which tags to show on a map (if any)?
  * Probably a `getTags` function passed to the `renderMap`
  * And we could potentially also have a `tagIds` array we use as a fallback
  * If there's not `tagIds` and no `getTags` just don't render any (or show all?)
* Show drawer with tag info on click
* Pan and zoom
  * Show controls
  * Add option to hide controls
  * Add option to disable pan and/or zoom indpenendently
* Package some SVG assets directly with Webpack rather than using the
  `/assets/tag.svg` URL which obviously won't necessarily exist on a customer
  site
* Is there a better way we can use Webpack Bundle Analyzer so it doesn't hold up
  the rest of the build waiting for us to hit Control-C
* Strip prop-types from production build using
  <https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types>
* Do we need a watermark on the map lol?
