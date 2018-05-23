# Meridian Web Components

## TODO

* We should probably have a different way of injecting the API?

## Editor Web SDK integration page example

NOTE: <TOKEN> will be replaced in the snippet automatically for convenience. And
<ENVIRONMENT> will either be "production" or "production-eu" depending on the
location's context.

## Example

Hello, please enjoy our provided JS SDK!

### npm Installation

```js
// npm install @meridian/web-models @meridian/web-components

const MeridianWebModels = require("@meridian/web-models");
const MeridianWebComponents = require("@meridian/web-components");

var domTarget = document.getElementById("meridian-map");
MeridianWebComponents.init({
  api: MeridianWebModels.create({
    environment: "<ENVIRONMENT>",
    token: "<TOKEN>"
  })
});
MeridianWebComponents.createMap(domTarget, {
  locationId: "...",
  floorId: "..."
});
```

### Script Tag Installation

```html
<script src="https://google-cloud-storage.com/web-models.js"></script>
<script src="https://google-cloud-storage.com/web-components.js"></script>

<script>
var domTarget = document.getElementById("meridian-map");
MeridianWebComponents.init({
  api: MeridianWebModels.create({
    environment: "<ENVIRONMENT>",
    token: "<TOKEN>"
  })
});
MeridianWebComponents.createMap(domTarget, {
  locationId: "...",
  floorId: "..."
});
</script>
```
