var map = window.TheMap;
var $ = window.jQuery;

var state = {
  placemarks: false,
  tags: true
};

function updateMap() {
  map.update({
    markers: {
      placemarks: { all: state.placemarks },
      tags: { all: state.tags }
    }
  });
}

$("#show-placemarks").on("change", function() {
  state.placemarks = this.checked;
  updateMap();
});

$("#show-tags").on("change", function() {
  state.tags = this.checked;
  updateMap();
});
