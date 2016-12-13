/**
 * Created by baultik on 12/12/16.
 */
function Places() {
    var mMap = null;
    var mPlacesService = null;
    var mPlaces = [];
    var mSearchRadius = 15000;//in meters
    var mSearchQuery = null;
    var mDirection = {
        north:"north",
        south:"south",
        east:"east",
        west:"west"
    };
    var mLocation = null;

    this.init = function (map,location) {
        mMap = map;
        mLocation = location;
        mPlacesService = new google.maps.places.PlacesService(mMap);
    };

    this.search = function (search, location) {
        mSearchQuery = search;
        var request = createRequest(search,location);
        //console.log("sending request...",request);
        mPlacesService.nearbySearch(request,parseResponse);
    };
    
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

    function parseResponse(results,status) {
        console.log("Got response",results);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i in results) {
                var placeResult = results[i];//PlaceResult objects
                if (placeResult.name == mSearchQuery) {
                    mPlaces.push(placeResult);//store all results matching exactly the search query
                }
            }

            //TODO: get filter direction
            mPlaces = filterByDirection(mDirection.west,mPlaces);
            for (var i in mPlaces) {
                var filteredPlace = mPlaces[i];
                createMarker(filteredPlace,mLocation);
            }
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