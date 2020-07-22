## To test your changes in the Web SDK

Have someone **besides** the author do the following:

### npm bundle still works

- Go to your project directory and run:

```sh
$ cd meridian-web-sdk
$ rm -f meridian-web-sdk-*.tgz
$ npm run build
$ npm pack
$ cd ../meridian-editor-frontend/meridian-client
$ npm install ../../meridian-web-sdk/meridian-web-sdk-${VERSION}.tgz
```

- Ensure that the "Web SDK" screen in the Editor appears to function correctly
  still
  - Map, placemarks, and tag data load
  - The provided checkboxes still work

### Demos still work

- Test that the examples in the `demo` folder still work
