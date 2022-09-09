// Leaflet Challenge 1
// Started to modularise for challenge

function markerSize(magnitude) {
    return magnitude * 4;
}

function markerColor(magnitude) {
  if (magnitude <= 1) {
      return "#cadb86"
  } else if (magnitude <= 2) {
      return "#dbd986"
  } else if (magnitude <= 3) {
      return "#dedc7c"
  } else if (magnitude <= 4) {
      return "#d1ab6f"
  } else if (magnitude <= 5) {
      return "#c4583b"
  } else {
      return "#a33e22"
  }
};

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.place +
"</h2><hr><p>" + new Date(feature.properties.time) + "</p>" + "</h2><hr><p>" + "Magnitude: " + (feature.properties.mag) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: 1,
            weight: 0.3,
            opacity: 0.3,

        });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var myMap = L.map("map", {
    center: [34.0522, -118.2437],
      zoom: 6,
    layers: [lightmap, earthquakes]
  });

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      magnitudes = [0, 1, 2, 3, 4, 5];
      labels = [];
      legendLabel = "<bold>Range</bold>";
      div.innerHTML = legendLabel;

      for (var i = 0; i < magnitudes.length; i++) {
          labels.push('<li style="background-color:' + markerColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1]
          ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
      }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };

  legend.addTo(myMap);

};

const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});
