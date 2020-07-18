## To test your changes in the web sdk

- Go to your project directory and run:

```sh
$ cd meridian-web-sdk
$ npm run build
$ npm pack
$ cd ../meridian-editor-frontend/meridian-client
$ npm install ../../meridian-web-sdk/meridian-web-sdk-${VERSION}.tgz
```

- Modify the MEF code to use the new feature
