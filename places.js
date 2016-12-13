/**
 * Created by baultik on 12/12/16.
 */
/**
 * Places contructor. Handles searching for places based on a search query.
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
    var mLocation = null;
    var mBearing = null;
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
    this.search = function (search, location,bearing) {
        mSearchQuery = search;
        mLocation = location;
        mBearing = bearing;
        var request = createRequest(search,location);
        mPlacesService.nearbySearch(request,parseResponse);
    };

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
        populateMap(mHeading,mAllPlaces);
    };

    function populateMap(direction,places) {
        places = filterByDirection(direction,places);
        for (var i in places) {
            var filteredPlace = places[i];
            createMarker(filteredPlace,mLocation);
        }

        if (places.length == 0) {
            showNoPlaces(mSearchQuery);
        }
    }
    
    function filterByDirection(direction,places) {
        var output = [];
        for (var i in places) {
            var place = places[i];
            var coordinates = place.geometry.location.toJSON();
            var center = mLocation;

            switch (direction) {
                case mDirection.south:
                    if (coordinates.lat < center.lat)output.push(place);
                    break;
                case mDirection.east:
                    if (coordinates.lng > center.lng)output.push(place);
                    break;
                case mDirection.west:
                    if (coordinates.lng < center.lng)output.push(place);
                    break;
                default:
                    if (coordinates.lat > center.lat)output.push(place);
                    break;
            }
        }

        return output;
    }

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

    function parseResponse(results,status) {
        console.log("Got response",results);
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
            populateMap(mHeading,mPlaces);
        }
    }

    function createRequest(search,location) {
        var request = {
            location:location,
            radius:mSearchRadius,
            name:search
        };
        return request;
    }
}
