/**
 * Created by baultik on 12/12/16.
 */
function Directions() {
    var mDirectionService = null;
    var mDirectionDisplay = null;
    var mMap = null;
    var mPanel = $("#directionsPanel")[0];

    this.init = function(map) {

        mDirectionService = new google.maps.DirectionsService();
        mDirectionDisplay = new google.maps.DirectionsRenderer({
            // suppressMarkers: true
            markerOptions:{
                // visible:false
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

        mDirectionDisplay.setMap(mMap);
        mDirectionDisplay.setPanel(mPanel);

        mDirectionService.route(request, function(result, status) {
            if (status == 'OK') {
                mDirectionDisplay.setDirections(result);
            }
        });
    };

    this.clearDirectionsPoly = function () {
        mDirectionDisplay.setMap(null);
    };

    this.clearTurnByTurn = function () {
        mDirectionDisplay.setPanel(null);
    }
}