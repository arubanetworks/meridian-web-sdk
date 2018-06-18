# Meridian Web SDK Assets

Seeing as most of the assets can be easily loaded on demand and bundling them
would drastically bloat our size. This subproject is here for us to manage our
SVG assets and upload minified versions of them to Google Cloud Storage for use
in the Web SDK.

## How to deploy

```sh
$ npm --no-git-tag-version version <VERSION_TO_DEPLOY>
```
