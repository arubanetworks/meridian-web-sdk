## Get Directions Feature API Documentation (Beta)

The following describes Meridian's beta version of directions using the Web SDK.

With this, you can use the Web SDK to generate directions from a fixed starting location placemark to a user selected ending placemark location.

**Please note** that this will not use either a user selected starting location or a blue dot location. This feature is intended primarily for map kiosks that stay in a fixed location.

Complete the following steps to get started using the Web SDK to generate direction routes.

1. Install the latest `directionsbeta` release from npm. 

```
npm install @meridian/web-sdk@directionsbeta
```

You can also download it directly from Meridian at https://files.meridianapps.com/meridian-web-sdk/0.0.0-directionsbeta.2/meridian-sdk.js.

2. In the Meridian Editor, find a starting placemark location, and get its placemark ID value. Add the placemark ID value to the `youAreHerePlacemarkID` option in your `createMap` call:

```
MeridianSDK.createMap(document.getElementById("meridian-map"), {
    locationID: "123456789098765",
    floorID: "09876543210987654",
    height: "100%",
    youAreHerePlacemarkID: "678901234567_5432109876543"
});
```
The Meridian SDK map will display a "You Are Here" icon representing the location of the starting placemark location (such as a kiosk) that can show directions to other placemarks on the same map. When selected, other placemarks will show a **GET DIRECTIONS** button to generate directions from the starting location.
