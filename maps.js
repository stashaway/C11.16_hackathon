/**
 * Created by sloan on 12/12/2016.
 */
var locations = [                   // these will be passed in by variables, not hard coded.
    ['Bondi Beach', -33.890542, 151.274856, 4],
    ['Coogee Beach', -33.923036, 151.259052, 5],
    ['Cronulla Beach', -34.028249, 151.157507, 3],
    ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
    ['Maroubra Beach', -33.950198, 151.259302, 1]
];

var infowindow;
var map;
// function populate_locations_array(restaurant_name,)
var directions;
var marker, i;
function makemap() {
for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
        }
    })(marker, i));
}}

function prepare_map(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infowindow = new google.maps.InfoWindow();
    directions = new Directions();
    //makemap();
}

//https://maps.google.com/maps?ll=33.66964,-117.762779&z=17&t=m&hl=en-US&gl=US&mapclient=apiv3&cid=9583901462909674968

function createMarker(placeResult) {
    console.log(placeResult);
    directions.init(map);

    var this_img;
    for (var loop=0; loop < image_array.length; loop++ ){
         if (placeResult.name === image_array[loop].name) {
             this_img = image_array[loop].image;
             break;
         }
    }

    var marker = new google.maps.Marker({
        map: map,
        icon:{
            url:"images/" + this_img,
            scaledSize : new google.maps.Size(30,30,"px","px")
        },
        place: {
            placeId: placeResult.place_id,
            location: placeResult.geometry.location
        }
    });

    google.maps.event.addListener(marker,"click", (function (marker,placeResult) {
        return function () {
            var info = $("<button>",{
                class:"btn btn-default",
                type:"button",
                text:"Directions"
            });

            info.on("click",function () {
                var destination = placeResult.geometry.location;
                var origin = new google.maps.LatLng(33.6361934,-117.7415816);
                directions.clearMap();
                directions.showDirection(origin,destination);
                infowindow.close();
            });

            var title = $("<h6>",{
                text:"Wendys"
            });

            var infodiv = $("<div>");
            infodiv.append(title,info);

            infowindow.setContent(infodiv[0]);
            infowindow.open(map,marker);
        }
    })(marker,placeResult));
}
