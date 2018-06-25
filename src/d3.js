// This file is here as a "minimal" version of d3 in order to save on file size,
// but keep the `d3.foo`, `d3.bar` syntax convention alive. Otherwise you have
// to do a bunch of `import { zoom as zoomD3 } from "d3-zoom"` import lines that
// really make the code more confusing to read. This is all set up using a
// webpack alias so you can keep doing `import d3 from "d3"` in your code and it
// _just works_ as long as you don't need anything not exported from this file.

import { zoom, zoomTransform, zoomIdentity } from "d3-zoom";
import { select, event } from "d3-selection";

export { zoom, zoomTransform, zoomIdentity, select, event };
