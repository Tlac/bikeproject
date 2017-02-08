// Initializing map and default center
var mymap = L.map('map').setView([43.70362,-79.38309], 12);

//default time of the day and default day of the week
var totd = 13;
var dotw = 0;

// Initializing custom icons
var defaultIcon = new L.Icon({
  iconUrl: './img/marker.png',
  shadowUrl: './img/marker-shadow.png',
  
  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 40], // the same for the shadow
  popupAnchor:  [0, -35]  // point from which the popup should open relative to the iconAnchor
});

var greenIcon = new L.Icon({
  iconUrl: './img/green_trans.png',
  shadowUrl: './img/marker-shadow.png',
  
  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 40], // the same for the shadow
  popupAnchor:  [0, -35]  // point from which the popup should open relative to the iconAnchor
});
  
var darkGreenIcon = new L.Icon({
  iconUrl: './img/dark_green_trans.png',
  shadowUrl: './img/marker-shadow.png',
  
  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 40], // the same for the shadow
  popupAnchor:  [0, -35]  // point from which the popup should open relative to the iconAnchor
});

var yellowIcon = new L.Icon({
  iconUrl: './img/yellow_trans.png',
  shadowUrl: './img/marker-shadow.png',
  
  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 40], // the same for the shadow
  popupAnchor:  [0, -35]  // point from which the popup should open relative to the iconAnchor
});

var orangeIcon = new L.Icon({
  iconUrl: './img/orange_trans.png',
  shadowUrl: './img/marker-shadow.png',
  
  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 40], // the same for the shadow
  popupAnchor:  [0, -35]  // point from which the popup should open relative to the iconAnchor
});
  
var redIcon = new L.Icon({
  iconUrl: './img/red_trans.png',
  shadowUrl: './img/marker-shadow.png',
  
  iconSize:     [25, 41], // size of the icon
  shadowSize:   [41, 41], // size of the shadow
  iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 40], // the same for the shadow
  popupAnchor:  [0, -35]  // point from which the popup should open relative to the iconAnchor
});

// Set colour based on the number of cyclist
function getColor(d) {
	return 	d > 400     ? '#AB356C' :
	   		d > 300     ? '#AB726C' :
      	 	d > 200     ? '#D9E508' :
		 	d > 100     ? '#8CB66C' :
                        '#00D06C';
}

// Defining tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

// Loading initial point information
L.geoJson(bikeData, {
    pointToLayer: function(feature, latlng){

        var iconColour = feature.properties.data[dotw].time[totd] > 400     ?  redIcon :
            feature.properties.data[dotw].time[totd] > 300     ?  orangeIcon :
            feature.properties.data[dotw].time[totd] > 200     ?  yellowIcon :
            feature.properties.data[dotw].time[totd] > 100     ?  darkGreenIcon:
            greenIcon;


        marker = L.marker(latlng, {
                icon: iconColour,
                title: feature.properties.name,
                alt: "Resource Location",
                riseOnHover: true,
	            numberOfCyclist: feature.properties.data[dotw].time[totd],
	        }).bindPopup('<h4>' + feature.properties.name + '</h4><br/> Date: ' + feature.properties.data[dotw].date + '<br/> Number of cyclist: ' + (feature.properties.data[dotw].time[totd] > -1 ? feature.properties.data[dotw].time[totd] : 'No Data'),{autoPan: false});
        return marker;
    }
}).addTo(mymap);

// dragbar *********************************************************

// Declaring various properties of the dragbar
const $element = $('input[type="range"]');
const $tooltip = $('#range-tooltip');
const sliderStates = [
  {name: "morning", tooltip: "Morning", range: _.range(0, 11) },
  {name: "noon", tooltip: "Noon", range: _.range(11, 13)},
  {name: "afternoon", tooltip: "Afternoon", range: _.range(13, 18)},
  {name: "night", tooltip: "Night", range: _.range(18, 23)}
];

function formatTime(time){
  //time = parseInt(time) +1;
  if (time == 0){
    return '12AM';
  } else if (time < 12){
    return time.toString() + 'AM';
  } else if (time == 12){
    return time.toString() + 'PM';
  } else {
    return (time-12).toString() + 'PM';
  } 
}

var currentState;
var $handle;

$element
    .rangeslider({
        polyfill: false,
        onInit: function() {
            $handle = $('.rangeslider__handle', this.$range);
            updateHandle($handle[0], formatTime(this.value));
            updateState($handle[0], this.value);
            console.log(this.value);
        }
    })
    .on('input', function() {
        updateHandle($handle[0], formatTime(this.value));
        checkState($handle[0], this.value);
        console.log(this.value);
        totd = parseInt(this.value);

        mymap.eachLayer(function (layer) {
            if (layer.options.pane == 'markerPane'){
                mymap.removeLayer(layer);
            }//console.log(layer);
        });

        // Adding the data to the map (data located in torontobikedata_number.js)
        L.geoJson(bikeData, {
            pointToLayer: function(feature, latlng){
                var iconColour = feature.properties.data[dotw].time[totd] > 400     ?  redIcon :
                    feature.properties.data[dotw].time[totd] > 300     ?  orangeIcon :
                    feature.properties.data[dotw].time[totd] > 200     ?  yellowIcon :
                    feature.properties.data[dotw].time[totd] > 100     ?  darkGreenIcon:
                    greenIcon;
                marker = L.marker(latlng, {
                        icon: iconColour,
                        title: feature.properties.name,
                        alt: "Resource Location",
                        riseOnHover: true,
                        numberOfCyclist: feature.properties.data[dotw].time[totd]
                    }).bindPopup('<h4>' + feature.properties.name + '</h4><br/> Date: ' + feature.properties.data[dotw].date + '<br/> Number of cyclist: ' + (feature.properties.data[dotw].time[totd] > -1 ? feature.properties.data[dotw].time[totd] : 'No Data'),{autoPan: false});
                return marker;
            }
        }).addTo(mymap);
    }
);

// Update the value inside the slider handle
function updateHandle(el, val) {
  el.textContent = val;
}

// Check if the slider state has changed
function checkState(el, val) {
  // if the value does not fall in the range of the current state, update that shit.
  if (!_.contains(currentState.range, parseInt(val))) {
    updateState(el, val);
  }
}

// Change the state of the slider
function updateState(el, val) {
    for (var j = 0; j < sliderStates.length; j++){
        if (_.contains(sliderStates[j].range, parseInt(val))) {
            currentState = sliderStates[j];
        }
    }

    // Update handle color
    $handle
        .removeClass (function (index, css) {
            return (css.match (/(^|\s)js-\S+/g) ||   []).join(' ');
        })
        .addClass("js-" + currentState.name);
        // Update tooltip
    $tooltip.html(currentState.tooltip);
}

// Triggers when a new radio button is clicked(a new day is chosen)
$("input:radio[name=dayoftheweek]").change(function(){
    console.log($('input:radio[name=dayoftheweek]:checked').val());

    mymap.eachLayer(function (layer) {
	    if (layer.options.pane == 'markerPane'){
    		mymap.removeLayer(layer);
	    }//console.log(layer);
    });

    //
    dotw = parseInt($('input:radio[name=dayoftheweek]:checked').val());

    // Reload points after the user chooses a new day
    L.geoJson(bikeData, {
        pointToLayer: function(feature, latlng){

            var iconColour =  feature.properties.data[dotw].time[totd] > 400     ?  redIcon :
                feature.properties.data[dotw].time[totd] > 300     ?  orangeIcon :
                feature.properties.data[dotw].time[totd] > 200     ?  yellowIcon :
                feature.properties.data[dotw].time[totd] > 100     ?  darkGreenIcon:
                                              greenIcon;

            marker = L.marker(latlng, {
                icon: iconColour,
                title: feature.properties.name,
                alt: "Resource Location",
                riseOnHover: true,
                numberOfCyclist: feature.properties.data[dotw].time[totd],
            }).bindPopup('<h4>' + feature.properties.name + '</h4><br/> Date: ' + feature.properties.data[dotw].date + '<br/> Number of cyclist: ' + (feature.properties.data[dotw].time[totd] > -1 ? feature.properties.data[dotw].time[totd] : 'No Data'),{autoPan: false});

            return marker;
        }
    }).addTo(mymap);
});

// Creating the legend 
var legend = L.control({position: 'bottomleft'});

// Adding content to the legend 
legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0,100,200,300,400],
		labels = [],
		from, to;
	labels.push('<b>Legend</b>');
	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];
		
		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + ' cyclists ' + (to ? '&ndash;' + to +' cyclists ' : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

// Adding the legend to the map
legend.addTo(mymap);