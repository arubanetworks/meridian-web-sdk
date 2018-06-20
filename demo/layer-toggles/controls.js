/* eslint-disable no-console */

var map = window.TheMap;
var $ = window.jQuery;

var state = {
  placemarks: { all: false },
  tags: { all: true }
};

function updateMap() {
  map.update({
    markers: {
      placemarks: state.placemarks,
      tags: state.tags
    }
  });
}

var tagFilters = {
  "filter-none": { all: false },
  "filter-all": { all: true },
  "filter-Adam": { labels: ["Adam"] },
  "filter-AHMqsGp": { labels: ["AHMqsGp"] }
};

$("#show-placemarks").on("change", function() {
  state.placemarks = { all: this.checked };
  updateMap();
});

$("[name='tag-filter']").on("change", function() {
  state.tags = tagFilters[this.value];
  updateMap();
});
