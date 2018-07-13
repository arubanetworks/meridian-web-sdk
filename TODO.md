### NEXT

- JS API documentation
- Allow switching `floorID`s after loading (group by building)
- Search for tag by name
- Audit State usage
- Culling! (openstreetmap/ID uses RBush)

### NEED

- `@meridian` namespace on npm
- What license for the library?
  - Put the license at the top of the JS bundle and index.js
- Open source on GitHub or keep it private and only publish minified source on
  GCS and npm

### PERFORMANCE

- Do in-depth performance testing
- Using a background SVG for the map directly affects performance in Firefox

### OTHER

- (like tags app) add 'controlTags' to tag options (to show control tags, defaults to false)
- (like tags app) add location switching functionality
- Tag updates are coming in first (onTagUpdate)
- Hit Escape to close overlay modal
- Make a new hidden page with copy/paste API code
- Map scale like `[_____] = 50 ft`
