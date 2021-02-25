# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Upgraded the map SVG for the examples

### Added

- `onMapClick()` option which is called when the map is clicked

### Removed

- Removed undocumented and unsupported option `onMarkerClick`

## [0.13.1] - 2021-02-19

### Fixed

- An issue where an HTTP 401 related message would log to the console; now we
  give a helpful suggestion to use `loadTags: false` in this scenario

- The "basic" demo didn't work correctly

## [0.13.0] - 2021-02-17

### Added

- `loadTags: false` option to avoid loading tags

### Fixed

- An issue where a loading spinner would stay indefinitely when using the Web
  SDK on a location without access to tags

## [0.12.3] - 2021-02-17

### Changed

- Updated API documentation formatting for code examples
- Overlay polygons are now drawn as `<polygon>` instead of `<path>`

## [0.12.2] - 2021-02-11

### Changed

- Online demos use a snapshot of data now for a more consistent experience

## [0.12.1] - 2021-02-08

### Fixed

- Console error: `placemarkIconURL: no such icon 'label_department'`

## [0.12.0] - 2021-02-08

### Added

- `MeridianSDK.placemarkIconURL(type)` return URL to an icon representing the
  given placemark type
- `onPlacemarksUpdate({ allPlacemarks, filteredPlacemarks })` callback to
  `createMap`
- `overlays` array in `createMap`, to draw custom polygons or polylines over the
  map
- `onFloorChange` callback in `createMap`
- `annotations` array in `createMap`, to draw custom images and text

## [0.11.0] - 2020-11-19

### Added

- `map.destroy()` is now optional; a `MeridianMap` can detect being disconnected
  from the DOM and automatically destroy itself

## [0.10.0] - 2020-11-19

### Added

- `map.destroy()` method which should be called when you're done with a map, to
  close network connections (e.g. in a single page app, or when using JS that
  removes the map container from the DOM, or replaces its contents via
  `innerHTML`)

## [0.9.0] - 2020-11-06

### Fixed

- Unpublished floors are now hidden from the floor selector and tags list
- Placemarks wouldn't update after changing floors
- `loadPlacemarks` didn't work correctly

### Added

- `api.fetchTagsByFloor()`
- `api.fetchTagsByLocation()`
- `api.fetchPlacemarksByFloor()`
- `api.fetchFloorsByLocation()`
- `api.fetchSVG()`

### Changed

- `api.token` is now read-only
- `api.environment` is now read-only

### Deprecated

- `api.axios`

## [0.8.1] - 2020-09-09

### Fixed

- `locationID` can now be changed after calling `createMap`

- Exclusion zones are now hidden

### Documentation

- Adds an Example, titled "Tag/Marker click, prevent default and show additional options", to demo customization of a Tag/Marker click callback -- overriding the default modal, and showing marker data in a sidebar

## [0.8.0] - 2020-07-23

### Added

- Option `loadPlacemarks` that when false causes the map to not load
  placemark data (defaults to `true`; it can be updated via `update` to true
  later if you want to load the data at a later time)

## [0.7.8] - 2020-06-26

### Added

- Placemark ID selectors `.meridian-placemark-icon[data-meridian-placemark-id="..."]`

- Tag ID selectors `.meridian-tag[data-meridian-tag-id="..."]`

- An example for styling a specific placemark called "Placemark Customization"

### Changed

- Replaced inline styles with CSS Custom Properties for easier customization of
  Placemarks and Tags

## [0.7.7] - 2020-06-08

### Changed

- Updates documentation for `onTagsUpdate` to clarify it only receives tags for
  the current floor

## [0.7.6] - 2020-05-15

### Added

- Descriptions to examples page

## [0.7.5] - 2020-05-11

### Added

- More examples to documentation

## [0.7.4] - 2020-05-07

### Fixed

- An internal code crash

## [0.7.3] - 2020-05-05

### Fixed

- Download link now points directly to unpkg

## [0.7.2] - 2020-05-05

- Fixes broken links

## [0.7.1] - 2020-05-05

### Added

- Exposes the `API` class directly so you can use `new API(options)` instead of `createAPI(options)`

### Changed

- Deprecates `createAPI(options)`

- Switches to TypeDoc for documentation

## [0.7.0] - 2020-04-10

### Changed

- **(BREAKING)** Tag data returned from API has a new schema

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

- Switched TypeScript compiler to target ES2017

### Fixed

- Tag labels wouldn't line wrap in the tag list

- Placemarks didn't hide while loading placemarks for a new
  floor

- Map images didn't hide while loading the map image for a new
  floor

- A few race conditions involving incorrect data appearing onscreen when
  switching floors quickly

## [0.6.0] - 2020-03-26

### Added

- TypeScript support

### Changed

- `MeridianSDK.restrictedPanZoom` now supports any modifier key, not just Shift

### Fixed

- `onTagUpdate` was not called from `createAPI`

- If `showTagsControl` was false, all control tags would be
  hidden on the map

- The map background image would fail to load unless the user
  also had access to [edit.meridianapps.com](https://edit.meridianapps.com).

## [0.5.0] - 2019-02-25

### Added

- `onTagClick(data, options)` - (optional) callback function called
  whenever a tag is clicked, receiving the tag data and an options object. The
  options object contains a `preventDefault` function. Call
  `options.preventDefault()` to prevent the overlay from appearing.

- `onPlacemarkClick(data, options)` - (optional) callback function called
  whenever a placemark is clicked, receiving the tag data and an options object.
  The options object contains a `preventDefault` function. Call
  `options.preventDefault()` to prevent the overlay from appearing.

## [0.4.1] - 2018-10-03

The differences are compared to the old pre-release beta version.

## Changed

- The `all`, `ids`, `labels`, and `types` props for `tags` and `placemarks` have
  been replaced with a single `filter` function prop for full control over
  filtering behavior

- `onTagsUpdate(tagsByMAC)` is now `onTagsUpdate(tags)`, where `tags` is an
  object with `allTags` and `filteredTags` keys, which point to arrays of tags

- `onFloorsUpdate(floorsByBuilding)` is now `onFloorsUpdate(floors)`, passing an
  array of floors rather than an object

- `onTagDisappear` is now called `onTagLeave`

- Data passed to callbacks follows the same format as the Meridian endpoints now

## Other Releases

Previous releases were internal only and not documented.
