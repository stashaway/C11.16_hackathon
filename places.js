/**
 * Created by baultik on 12/12/16.
 */
/**
 * Places constructor. Handles searching for places based on a search query.
 * @constructor
 */
function Places() {
    var mMap = null;
    var mPlacesService = null;
    var mPlaces = [];
    var mAllPlaces = null;
    var mSearchRadius = 10000;//in meters
    var mSearchQuery = null;
    var mDirection = {
        north: "north",
        south: "south",
        east: "east",
        west: "west"
    };
    /**
     * The current location when a search is initiated. Passed as a LatLngLiteral
     * @type {Object}
     */
    var mLocation = null;
    /**
     * The direction headed in degrees
     * @type {Number}
     */
    var mBearing = null;
    /**
     * The general direction determined by {@link mBearing}
     * @type {String}
     */
    var mHeading = null;
    /**
     * Initialize Places service
     * @param map
     */
    this.init = function (map) {
        mMap = map;
        mPlacesService = new google.maps.places.PlacesService(mMap);
    };
    /**
     * Search for a place
     * @param search The search query
     * @param location Where you are
     * @param bearing What direction you're going in degrees
     */
    this.search = function (search, location, bearing) {
        mSearchQuery = search;
        mLocation = location;
        mBearing = bearing;
        var request = createRequest(search, location);
        mPlacesService.nearbySearch(request, parseResponse);
    };
    /**
     * Switch direction to it's opposite ie North to South
     */
    this.switchDirection = function () {
        var direction = mDirection.north;
        switch (mHeading) {
            case mDirection.north:
                direction = mDirection.south;
                break;
            case mDirection.east:
                direction = mDirection.west;
                break;
            case mDirection.west:
                direction = mDirection.east;
                break;
            default:
                direction = mDirection.north;
                break;
        }
        mHeading = direction;
        clearMarkers();
        populateMap(mHeading, mAllPlaces);
    };
    /**
     * Populate the map with the places
     * @param direction The direction to filter results
     * @param places The matching places
     */
    function populateMap(direction, places) {
        places = filterByDirection(direction, places);
        for (var i in places) {
            var filteredPlace = places[i];
            createMarker(filteredPlace, mLocation);
        }

        if (places.length == 0) {
            showNoPlaces(mSearchQuery);
        }
    }

    /**
     * Filters places by a general direction
     * @param direction The general direction ie North or South
     * @param places The matching places
     * @returns {Array} An array of filtered places
     */
    function filterByDirection(direction, places) {
        var output = [];
        for (var i in places) {
            var place = places[i];
            var coordinates = place.geometry.location.toJSON();
            var center = mLocation;

            switch (direction) {
                case mDirection.south:
                    if (coordinates.lat < center.lat) output.push(place);
                    break;
                case mDirection.east:
                    if (coordinates.lng > center.lng) output.push(place);
                    break;
                case mDirection.west:
                    if (coordinates.lng < center.lng) output.push(place);
                    break;
                default:
                    if (coordinates.lat > center.lat) output.push(place);
                    break;
            }
        }

        return output;
    }

    /**
     * Translates a bearing in degrees to a general direction
     * @param bearing The bearing with east being 0deg and west being 180deg
     * @returns {*} A general direction
     */
    function translateBearing(bearing) {
        if (bearing < 0) {
            bearing += 360;
        }

        if (bearing < 45 || bearing >= 315) {
            return mDirection.east;
        } else if (bearing >= 45 && bearing < 135) {
            return mDirection.north;
        } else if (bearing >= 135 && bearing < 225) {
            return mDirection.west;
        } else if (bearing >= 225 && bearing < 315) {
            return mDirection.south;
        }
        return null;
    }

    /**
     * Parse the response from the places api
     * @param results The results array containing PlaceResult objects
     * @param status The status of the search
     */
    function parseResponse(results, status) {
        console.log("Got response", results);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i in results) {
                var placeResult = results[i];//PlaceResult objects
                if (placeResult.name == mSearchQuery) {
                    mPlaces.push(placeResult);//store all results matching exactly the search query
                }
            }
            //keep a copy of all unfiltered matches
            mAllPlaces = mPlaces.slice();
            mHeading = translateBearing(mBearing);
            populateMap(mHeading, mPlaces);
        }
    }

    /**
     * Create a search request
     * @param search The search query
     * @param location The location to search around
     * @returns {{location: *, radius: number, name: *}}
     */
    function createRequest(search, location) {
        return {
            location: location,
            radius: mSearchRadius,
            name: search
        };
    }
}
