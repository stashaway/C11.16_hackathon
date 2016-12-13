/**
 * Created by baultik on 12/12/16.
 */
function Directions() {
    var directionService = null;
    var directionDisplay = null;
    var mMap = null;

    this.init = function(map) {
        directionService = new google.maps.DirectionsService();
        directionDisplay = new google.maps.DirectionsRenderer({
            panel:$("#directionsPanel")[0],
            markerOptions:{
                visible:false
            }
        });
        mMap = map;
    };

    this.showDirection = function(origin,destination) {
        var request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        };

        directionDisplay.setMap(mMap);

        directionService.route(request, function(result, status) {
            if (status == 'OK') {
                directionDisplay.setDirections(result);
            }
        });
    };

    this.clearMap = function () {
        directionDisplay.setMap(null);
    }
}