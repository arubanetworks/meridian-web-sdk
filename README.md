# Meridian Web SDK

## About

The Meridian WebSDK is designed to work with Aruba Location Services and
provides a limited set of APIs and functionality specific to web applications.

Note: Unlike Meridian's well known iOS and Android mobile SDKs, the WebSDK is not a
complete location services SDK.

## Documentation

Please read the [documentation][] for an installation and API guide.

## Examples

We have several [examples][] of how to use the SDK.

## Analytics

Analytics is disabled by default. To receive Meridian map events, provide an
`analyticsEndpoint` when creating the map:

```js
const map = MeridianSDK.createMap(mapElement, {
	api,
	locationID: "<location ID>",
	floorID: "<floor ID>",
	analyticsEndpoint: "https://your-service.example.com/meridian-analytics",
});
```

The endpoint receives a `POST` request containing Google Analytics Measurement
Protocol-compatible event data. Use an endpoint you control to add any required
measurement ID or API secret server-side. Do not put a Google Analytics API
secret in `analyticsEndpoint`, because browser users can see it.

[examples]: https://arubanetworks.github.io/meridian-web-sdk/examples
[download]: https://docs.meridianapps.com/hc/en-us/articles/360039669854-SDK-Downloads
[documentation]: https://arubanetworks.github.io/meridian-web-sdk/

## License

[MIT](LICENSE)
