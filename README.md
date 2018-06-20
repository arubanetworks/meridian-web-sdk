# Meridian Web Components

## Editor Web SDK integration page example

NOTE: <TOKEN> will be replaced in the snippet automatically for convenience. And
<ENVIRONMENT> will either be "production" or "production-eu" depending on the
location's context.

## Example

Hello, please enjoy our provided JS SDK!

### npm Installation

```js
// npm install --save @meridian/sdk

const MeridianWebSDK = require("@meridian/sdk");

MeridianWebSDK.init({
  api: MeridianWebSDK.createAPI({
    environment: "<ENVIRONMENT>",
    token: "<TOKEN>"
  })
});

MeridianWebSDK.createMap(document.getElementById("meridian-map"), {
  locationID: "...",
  floorID: "..."
});
```

### Script Tag Installation

```html
<script src="https://storage.googleapis.com/meridian-web-sdk/x.y.z/meridian.js"></script>
<script>
MeridianWebSDK.init({
  api: MeridianWebSDK.createAPI({
    environment: "<ENVIRONMENT>",
    token: "<TOKEN>"
  })
});

var map = MeridianWebSDK.createMap(document.getElementById("meridian-map"), {
  locationID: "...",
  floorID: "..."
});

map.update({
  // ...
});
</script>
```
