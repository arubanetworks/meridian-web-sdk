# Meridian Web SDK Assets

Dynamically loaded assets for the Meridian Web SDK.

## Why

Seeing as most of the assets can be easily loaded on demand and bundling them
would drastically bloat our size. This subproject is here for us to manage our
SVG assets and upload minified versions while keeping the versions separate from
the JS code.

## How to deploy

```sh
$ npm version <VERSION_TO_DEPLOY>
# or
$ npm version major
# or
$ npm version minor
# or
$ npm version patch
```

If you want to just test a version out, you can add a suffix like `0.1.2-beta3`
to make a test deployment that you can delete later.

Then you should commit the changes which should just be updating the version in
the `package.json` and `package-lock.json` files.

The assets are deployed to URLs like the following:

<https://storage.googleapis.com/meridian-web-sdk-assets/0.0.1/placemarks/placemark-generic.svg>

## Adding new icons

When you add new icons you should run `npm run minify` to minify all the SVGs.
Also, make sure the fill color is white or whatever you expect it to be so that
it can be used as an `<img>` or background image.

## Versioning

In the version string `major.minor.patch` we should probably use `patch` only if
we uploaded an asset incorrectly, use `minor` if we added a new icon, and use
`major` if we remove or drastically alter an icon. It's a little less
straightforward than code APIs but I thin that should make sense.
