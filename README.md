# Meridian Web Components

## TODO

- We should probably have a different way of injecting the API?

## Editor Web SDK integration page example

NOTE: <TOKEN> will be replaced in the snippet automatically for convenience. And
<ENVIRONMENT> will either be "production" or "production-eu" depending on the
location's context.

## Example

Hello, please enjoy our provided JS SDK!

### npm Installation

```js
// npm install --save @meridian/sdk

const Meridian = require("@meridian/sdk");

Meridian.init({
  api: Meridian.createAPI({
    environment: "<ENVIRONMENT>",
    token: "<TOKEN>"
  })
});

Meridian.createMap(document.getElementById("meridian-map"), {
  locationID: "...",
  floorID: "..."
});
```

### Script Tag Installation

```html
<script src="https://storage.googleapis.com/meridian-web-models/x.y.z/meridian.js"></script>
<script>
Meridian.init({
  api: Meridian.createAPI({
    environment: "<ENVIRONMENT>",
    token: "<TOKEN>"
  })
});

Meridian.createMap(document.getElementById("meridian-map"), {
  locationID: "...",
  floorID: "..."
});
</script>
```
