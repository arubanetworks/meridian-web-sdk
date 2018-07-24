### NEXT

- Make a new hidden page with copy/paste API code
- Try dogfooding the SDK in the Editor tag monitoring page
  - Option to hide floors control
- Add external UI for floor picker demo
- When placemark has no image use placemark icon with type-based BG color
- IE testing (spotted a few issues today)
- FF testing (icons don't get bigger when clicked, z-index is not reflected)
- Safari testing (icons don't get bigger when clicked, z-index is not reflected)
- Audit State usage
- Audit render calls
- Restore deploy to GCS script (as alternate deploy for regression and A/B testing)

### NEED

- `@meridian` namespace on npm
- Open source on GitHub or keep it private and only publish minified source on
  GCS and npm

### PERFORMANCE

- More performance testing
- Using a background SVG for the map directly affects performance in Firefox

### OTHER

- (like tags app) add 'controlTags' to tag options (to show control tags, defaults to false)
- (like tags app) add location switching functionality
- Add prop to hide floor switcher (we'd need that ourselves to consume the SDK in editor)
- Tag updates are coming in first (onTagUpdate)
- Culling! (openstreetmap/ID uses RBush)
- Map scale like `[_____] = 50 ft`
