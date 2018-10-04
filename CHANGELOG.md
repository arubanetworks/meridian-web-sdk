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
