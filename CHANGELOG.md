# v0.2.0-beta?? (YYYY-MM-DD)

- The `all`, `ids`, `labels`, and `types` props for `tags` and `placemarks` have been replaced with a single `filter` function prop for full control over filtering behavior
- `onTagsUpdate(tagsByMAC)` is now `onTagsUpdate(tags)`, passing an array of tags rather than an object
- `onFloorsUpdate(floorsByBuilding)` is now `onFloorsUpdate(floors)`, passing an array of floors rather than an object
