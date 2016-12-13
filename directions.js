/**
 * Created by baultik on 12/12/16.
 */
/**
 * Directions constructor. Handles directions requests and displaying on the map
 * @constructor
 */
function Directions() {
    var mDirectionService = null;
    var mDirectionDisplay = null;
    var mMap = null;
    var mPanel = $("#directionsPanel")[0];

    /**
     * Initialize the Directions Service and Renderer
     * @param map The map to show directions on
     */
    this.init = function(map) {
        mDirectionService = new google.maps.DirectionsService();
        mDirectionDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        mMap = map;
    };
    /**
     * Shows a direction on the map
     * @param origin Where you are
     * @param destination Where you're going
     */
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
    /**
     * Clears the route polyline on the map
     */
    this.clearDirectionsPoly = function () {
        mDirectionDisplay.setMap(null);
    };
    /**
     * Clears out the turn by turn directions panel
     */
    this.clearTurnByTurn = function () {
        mDirectionDisplay.setPanel(null);
    }
}