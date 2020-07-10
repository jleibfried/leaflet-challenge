// Store our API endpoint inside queryUrl
var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  // console.log(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array

// variable tech learned from here:
// https://leafletjs.com/examples/geojson/
var geojsonMarkerSmall = {
  radius: 8,
  fillColor: "green",
  color: "#000",
  weight: 1,
  opacity: .33,
  fillOpacity: .33
};


var geojsonMarkerMedium = {
  radius: 16,
  fillColor: "yellow",
  color: "#000",
  weight: 1,
  opacity: .66,
  fillOpacity: .66
};


var geojsonMarkerLarge = {
  radius: 32,
  fillColor: "red",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 1
};

var earthquakes = L.geoJSON(earthquakeData, {
    
    pointToLayer: function (feature, latlng) {
      if(feature.properties.mag < 1){
      return L.circleMarker(latlng, geojsonMarkerSmall);
      } else if (feature.properties.mag < 3 && feature.properties.mag >=1 ) {
        return L.circleMarker(latlng, geojsonMarkerMedium);
      }
      else {
        return L.circleMarker(latlng, geojsonMarkerLarge);
      }
  },
    
    // style: myStyle,
    
    onEachFeature: function(feature, layer) {
    
      // console.log(feature.properties.mag);
     // console.log(feature + " this " + layer);
      
      layer.bindPopup("<h3>" + feature.properties.mag +
        " Magnitude </h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  //console.log(earthquakeData);
  
}

function createMap(earthquakes) {

  // Define topoMap and darkmap layers

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Topographical Map": topoMap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the topoMap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
        // Minneapolis (centered on my neighborhood)
        44.95, -93.30
    ],
    // Deep focus to make sure there have not been any quakes in the neighbor lately
    zoom: 6,
    layers: [topoMap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
}
