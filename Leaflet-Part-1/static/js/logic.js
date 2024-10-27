// Create map, give it a streetmap and earthquakes layers to display when loading
let myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3,
});

// Create the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {

var div = L.DomUtil.create('div', 'info legend');
labels = ['<strong>Earthquake Depths</strong>'];
categories = ['0-20', '20-50', '50-100', '100-200', '200-400', '400+'];
colors = ['#fde725', '#7ad151', '#22a884', '#2a788e', '#414487', '#440154'];
for (var i=0; i<categories.length; i++) {

    div.innerHTML +=
    labels.push(
        '<i class="circle" style="background:' + colors[i] + '">' + '</i> ' + categories [i] + " km"
    )
}

div.innerHTML = labels.join('<br>');
return div;
};
legend.addTo(myMap);




// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Define the createFeatures function
function createFeatures(earthquakeData) {
  earthquakeData.forEach(function(feature) {
      // Create a marker for each earthquake
      let marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          radius: mag_to_size(feature.properties.mag),
          fillColor: depth_to_color(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      }).bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");

      // Add the marker to the map
      marker.addTo(myMap);
  });
}

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (earthquake_data) {
  console.log(earthquake_data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(earthquake_data.features);
});



// Function to determine color based on earthquake depth
function depth_to_color(depth){
  let color = '#fde725'
  if (depth < 20){
    color = '#fde725'
  }else if (depth<50){
    color = '#7ad151'
  }else if (depth<100){
    color = '#22a884'
  }else if (depth<200){
    color = '#2a788e'
  }else if (depth<400){
    color = '#414487'
  }else{
    color = '#440154'
  }
  return color
}

function mag_to_size(mag){
  let size = Math.sqrt(mag)*5;
  return size
}

/////////////////////////
