# v0.7.3 (2020-05-05)

- Download link now points directly to unpkg

# v0.7.2 (2020-05-05)

- Fixes broken links

# v0.7.1 (2020-05-05)

- Exposes the `API` class directly so you can use `new API(options)` instead of `createAPI(options)`
- Deprecates `createAPI(options)`
- Switches to TypeDoc for documentation

# v0.7.0 (2020-04-10)

- **(BREAKING CHANGE)** Tag data returned from API has a new schema
  - `tag.editor_data.tags` is now `tag.tags`
  - `tag.editor_data.is_control_tag` is now `tag.is_control_tag`
  - `tag.calculations.default.location.x` is now `tag.x`
  - `tag.calculations.default.location.y` is now `tag.y`
  - any other fields from `tag.editor_data` and `tag.calculations` have been
    moved up to the top level of the `tag` object
  - This may affect your SDK usage if you use the following callbacks:
    - Methods on the stream returned from `openStream()`
      - `stream.onInitialTags()`
      - `stream.onTagLeave()`
      - `stream.onTagUpdate()`
    - The options callbacks to `createMap()`
      - `onTagClick()`
      - `onTagsUpdate()`
      - `tags.filter()`
- Fixed a bug where tag labels wouldn't line wrap in the tag list
- Fixed a bug where placemarks didn't hide while loading placemarks for a new
  floor
- Fixed a bug where map images didn't hide while loading the map image for a new
  floor
- Switched TypeScript compiler to target ES2017
- Fixed a few race conditions involving incorrect data appearing onscreen when
  switching floors quickly

# v0.6.0 (2020-03-26)

- Added TypeScript support
- `MeridianSDK.restrictedPanZoom` now supports any modifier key, not just Shift
- Fixed a bug where `onTagUpdate` was not called from `createAPI`
- Fixed a bug where if `showTagsControl` was false, all control tags would be
  hidden on the map
- Fixed a bug where the map background image would fail to load unless the user
  also had access to <https://edit.meridianapps.com>.

# v0.5.0 (2019-02-25)

- Added `onTagClick(data, options)` - (optional) callback function called
  whenever a tag is clicked, receiving the tag data and an options object. The
  options object contains a `preventDefault` function. Call
  `options.preventDefault()` to prevent the overlay from appearing.

- Added `onPlacemarkClick(data, options)` - (optional) callback function called
  whenever a placemark is clicked, receiving the tag data and an options object.
  The options object contains a `preventDefault` function. Call
  `options.preventDefault()` to prevent the overlay from appearing.

# v0.4.1 (2018-10-03)

The differences are compared to the old pre-release beta version.

- The `all`, `ids`, `labels`, and `types` props for `tags` and `placemarks` have
  been replaced with a single `filter` function prop for full control over
  filtering behavior
- `onTagsUpdate(tagsByMAC)` is now `onTagsUpdate(tags)`, where `tags` is an
  object with `allTags` and `filteredTags` keys, which point to arrays of tags
- `onFloorsUpdate(floorsByBuilding)` is now `onFloorsUpdate(floors)`, passing an
  array of floors rather than an object
- `onTagDisappear` is now called `onTagLeave`
- Data passed to callbacks follows the same format as the Meridian endpoints now

# Other Releases

Previous releases were internal only and not documented.
