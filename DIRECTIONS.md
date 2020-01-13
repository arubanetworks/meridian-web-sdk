## Get Directions Feature (beta) API Documentation

The beta version of the new "get directions" feature of the Meridian Web SDK supports setting a static starting placemark ID and allowing a map user to view a direction line from the starting placemark to any other placemark on the same map, which is ideal for kiosk scenarios.

1. Install the latest `directionsbeta` release from `npm`: `npm install 0.0.0-directionsbeta.2` where `2` is the latest build.
2. Pick a placemark ID on a map of your choice and add it as the value of a new option called `youAreHerePlacemarkID` to your `createMap` call:

```
MeridianSDK.createMap(document.getElementById("meridian-map"), {
    locationID: "5198682008846336",
    floorID: "5755685136498688",
    height: "100%",
    youAreHerePlacemarkID: "5755685136498688_5668600916475904"
});
```

Your Meridian SDK Map will now display a "You Are Here" icon for this placemark representing the location of a kiosk that can display directions to other placemarks on the same map. Other placemarks on the map will automatically show a "GET DIRECTIONS" button in their information overlay.
