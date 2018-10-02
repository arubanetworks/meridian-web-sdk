# Meridian Web SDK

## License

[MIT](LICENSE)

## Documentation

Please read the [documentation][] from our site.

## Examples

We have several [examples][] of how to use the SDK.

## Installation

Install from npm:

```sh
$ npm install @meridian/web-sdk
```

And then for CommonJS imports use:

```js
var MeridianSDK = require("@meridian/web-sdk");
```

Or for ES modules imports:

```js
import MeridianSDK from "@meridian/web-sdk";
```

If you would like a standalone JS file with all dependencies bundled that you can use from a script tag, [download][] the latest version and include it:

```html
<script src="meridian-sdk.js"></script>
```

Which will make a global object called `MeridianSDK`

## Deployment

Run `npm version ____` with the version number to do a full npm, Google Cloud
Storage, and GitHub Pages deploy.

[examples]: https://arubanetworks.github.io/meridian-web-sdk
[download]: https://arubanetworks.github.io/meridian-web-sdk/meridian-sdk.js
[documentation]: https://docs.meridianapps.com/article/779-the-meridian-web-sdk
