The Meridian Web SDK officially supports evergreen versions of Firefox, Google Chrome, Microsoft Edge, and Safari browsers.

## API Reference

Visit [["web-sdk"]] to see the full API documentation.

## Overview

The Meridian Web SDK is a JavaScript library you can use to add dynamically updating and interactive Meridian maps to your site.

## Installation

Install from npm:

```sh
npm install @meridian/web-sdk
```

And then for CommonJS imports use:

```js
const MeridianSDK = require("@meridian/web-sdk");
```

Or for ES modules imports:

```js
import * as MeridianSDK from "@meridian/web-sdk";
```

If you would like a standalone JS file with all dependencies bundled that you can use from a script tag, [download][] the latest version and include it:

```html
<script src="meridian-sdk.js"></script>
```

Which will make a global object called `MeridianSDK`.

## Get Started

Before you can use the Meridian Web SDK, you'll need to obtain a read-only [API token][] from the Meridian Editor.

You can find the location and floor IDs for a specific map by opening that map in the Meridian Editor. The URL for the floor page contains the IDs you'll need:

`https://edit.meridianapps.com/w/location/`**Location-ID**`/floor/`**Floor-ID**

## Examples

You can check out our [examples][] to see example applications of the Web SDK.

## Web SDK Theming

Meridian Web SDK theming is done with Cascading Style Sheets (CSS).

Meridian external hook CSS classes are prefixed with `meridian-`.

Styles prefixed with `meridian--private--` are minified internal styles that you shouldn't use.

Given the complexity of CSS style interactions, Meridian can't guarantee style customizations won't be affected between minor version upgrades, but we'll make an effort to keep the external CSS hooks available for any necessary minor style tweaks.

### Target All Maps

To target all Meridian maps on one page, you'll want to use something like:

```css
body .meridian-map-container {
  border: 1px solid black;
}
```

### Target a Specific Map

To target a specific map, you can put a CSS class on the container element and target that:

```css
.my-map .meridian-map-container {
  border: 2px solid gray;
}
```

### Alter Backgrounds and Borders

To alter background styles, use:

```css
.meridian-map-background
```

To alter border styles, use:

```css
.meridian-map-container
```

### Target Map Buttons

You can also style the top level and floor name buttons.

### Style Placemarks

You can style placemarks by placemark type using:

```css
.meridian-placemark-type-{PLACEMARK-TYPE-NAME}
```

### Style Tags

You can style Tags with specific labels using:

```css
.meridian-tag-label-{LABEL-NAME}
```

[examples]: examples
[api token]: https://docs.meridianapps.com/hc/en-us/articles/360039670154-Authenticate-to-the-API
[download]: https://unpkg.com/@meridian/web-sdk@0.7.2/dist/meridian-sdk.js
