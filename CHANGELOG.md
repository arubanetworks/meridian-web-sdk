# v0.7.0 (????????)

- Fixed a bug where tag labels wouldn't line wrap in the tag list
- [BREAKING CHANGE] Tag data returned from API has a new schema
- Switched TypeScript compiler to target ES2017

# v0.6.0 (2020-03-26)

- Adds TypeScript support
- `MeridianSDK.restrictedPanZoom` now supports any modifier key, not just Shift
- Fixes a bug where `onTagUpdate` was not called from `createAPI`
- Fixes a bug where if `showTagsControl` was false, all control tags would be
  hidden on the map
- Fixes a bug where the map background image would fail to load unless the user also had access to <https://edit.meridianapps.com>.

# v0.5.0 (2019-02-25)

### Enhancements

- `onTagClick(data, options)` - (optional) callback function called whenever a tag is clicked, receiving the tag data and an options object. The options object contains a `preventDefault` function. Call `options.preventDefault()` to prevent the overlay from appearing.

- `onPlacemarkClick(data, options)` - (optional) callback function called whenever a placemark is clicked, receiving the tag data and an options object. The options object contains a `preventDefault` function. Call `options.preventDefault()` to prevent the overlay from appearing.

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
