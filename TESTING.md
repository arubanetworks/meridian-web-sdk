## To test your changes in the Web SDK

Have someone **besides** the author do the following:

- Go to your project directory and run:

```sh
$ cd meridian-web-sdk
$ rm -f meridian-web-sdk-*.tgz
$ npm run build
$ npm pack
$ cd ../meridian-editor-frontend/meridian-client
$ npm install ../../meridian-web-sdk/meridian-web-sdk-${VERSION}.tgz
```

- Modify the MEF code to use the new feature
