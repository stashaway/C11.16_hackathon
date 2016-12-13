/**
 * Created by sloan on 12/12/2016.
 */
var infoWindow = null;
var map = null;
var directions = null;
var markers = [];
var currentLocationMarker = null;
/**
 * Create and initialize maps objects
 */
function prepareMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infoWindow = new google.maps.InfoWindow();
    directions = new Directions();
    directions.init(map);
}
/**
 * Clear all markers off the map
 */
function clearMarkers() {
    for (var i in markers) {
        var marker = markers[i];
        marker.setMap(null);
    }
    markers = [];
    directions.clearTurnByTurn();
    directions.clearRoute();
}
/**
 * Create elements used in the {@link InfoWindow}
 * @param title The title string
 * @param details The detail/subtitle string
 * @returns {*|jQuery|HTMLElement}
 */
function createMarkerInfo(title, details) {
    var infoDiv = $("<div>");

    if (title) {
        var head = $("<h5>", {
            text: title
        });
        infoDiv.append(head);
    }

    if (details) {
        var address = $("<p>", {
            text: details
        });
        infoDiv.append(address);
    }

    return infoDiv;
}
/**
 * Create a marker and display it on the map
 * @param placeResult The place result object
 * @param origin The location to place the marker
 */
function createMarker(placeResult, origin) {
    //console.log(placeResult);
    infoWindow.close();

    var this_img;
    for (var loop = 0; loop < image_array.length; loop++) {
        if (placeResult.name === image_array[loop].name) {
            this_img = image_array[loop].image;
            break;
        }
    }

    var marker = new google.maps.Marker({
        map: map,
        icon: {
            url: "images/" + this_img,
            scaledSize: new google.maps.Size(30, 30, "px", "px")
        },
        place: {
            placeId: placeResult.place_id,
            location: placeResult.geometry.location
        }
    });

    markers.push(marker);

    google.maps.event.addListener(marker, "click", (function (marker, placeResult) {
        return function () {
            var infoDiv = createMarkerInfo(placeResult.name, placeResult.vicinity);

            var infoButton = $("<button>", {
                class: "btn btn-default",
                type: "button",
                text: "Directions"
            });

            infoButton.on("click", function () {
                var destination = placeResult.geometry.location;
                directions.clearRoute();
                directions.showDirection(origin, destination);
                infoWindow.close();
            });

            infoDiv.append(infoButton);
            infoWindow.setContent(infoDiv[0]);
            infoWindow.open(map, marker);
        }
    })(marker, placeResult));
}
/**
 * Displays the current location as a marker on the map
 * @param location The current location as a LatLngLiteral object
 */
function showCurrentLocation(location) {
    currentLocationMarker = new google.maps.Marker({
        map: map,
        icon: {
            url: "images/youarehere.png",
            scaledSize: new google.maps.Size(30, 30, "px", "px")
        },
        position: new google.maps.LatLng(location.lat, location.lng)
    });
}
/**
 * Display that there are no matching places in the {@link InfoWindow}
 * @param name The search query
 */
function showNoPlaces(name) {
    var infoDiv = createMarkerInfo("No " + name + " found this way.", "Try switching direction.");
    infoWindow.setContent(infoDiv[0]);
    infoWindow.open(map, currentLocationMarker);
}