/**
 * Created by sloan on 12/12/2016.
 */
$(document).ready(function(){
    build_page1();
    $('.main_body').on('click', '.logos_container div.col-xs-4', function(){
        build_page2($(this).attr('data-imgindex'));
    });
    $('.main_body').on('click', '#bottom_buttons button', function(){
        console.log(this);
        switch(this.id) {
            case "switch_directions":
                my_places.switchDirection();
                break;
            case "other_content":
                view_youtube_ads($(this).attr('data-button'));
                break;
            case "choose_again":
                build_page1();
                break;
        }
    });
    navigator.geolocation.getCurrentPosition(function(position) {   // gets starting location to be used to determine bearing
        starting_location=position.coords;
    });

});

var starting_location;
var second_location;
var direction;
var my_places = null;
var image_array = [
    {image: 'burgerking.jpg',
     name: 'Burger King'},
    {image: 'carls.jpg',
     name: "Carl's Jr."},
    {image: 'deltaco.jpg',
     name: "Del Taco"},
    {image: 'innout.jpg',
     name: "In-N-Out Burger"},
    {image: 'jackinthebox.jpg',
     name: "Jack in the Box"},
    {image: 'kfc.jpg',
     name: "KFC"},
    {image: 'mcdonalds.jpg',
     name: "McDonald's"},
    {image: 'tacobell.jpg',
     name: "Taco Bell"},
    {image: 'wendys.jpg',
     name: "Wendy's"}
];

function build_page1 () {
    $('.main_body *').remove();
    var div_container = $('<div>', {
        "class": "logos_container"
    });
    $('.main_body').append(div_container); //append container div into Main body
    var count = 0;
    for (var i = 0; i < 3; i++) {
        var div_row = $('<div>', { //created container div
            "class": "row"
        });
        $(div_container).append(div_row); //append div row into div container
        for (var j = 0; j < 3; j++) {
            var div_columns = $('<div>', {// created 3 div with class of "row"
                "class": "col-xs-4",
                "data-imgindex": count++
            });
            $(div_row).append(div_columns);
        }
    }
    for (var x = 0; x < image_array.length; x++) {

        var img = $("<img>", {
            "src": "images/" + image_array[x].image,
            "class": "img-circle"
        });
        $('[data-imgindex=' + x + ']').append(img);//append each image into row html

    }
    var bottom_text = $('<div>', {
        "class": "textAtBottom"
    });
    var only_h1 = $('<h1>').text('Choose some food!');
    var first_h3 = $('<h3>').text("We'll show you locations");
    var second_h3 = $('<h3>').text('on your way!');

    $('.main_body').append(bottom_text);
    $('.textAtBottom').append(only_h1, first_h3, second_h3);
}

function build_page2(button) {
    navigator.geolocation.getCurrentPosition(function(position) {
        direction = set_direction(position);
        build_page2_1(direction, button);
    });
}

function build_page2_1(direction, button) {
    var dpanel = $("<div>",{
        id: "directionsPanel"
    });
    $('.main_body *').remove();
    var food_name = image_array[button].name;
    var map_container = $('<div id = "map">');
    $('.main_body').append(map_container,dpanel);
    var bottom_choices = $('<div id="bottom_buttons">');
    var button1 = $('<button id = "switch_directions" class = "btn btn-primary btn-lg">').text('Switch Direction');
    var button2 = $('<button id = "other_content" class = "btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">').text('View YouTube').attr('data-button',button); //data-button is used here to correctly choose the YouTube video later
    var button3 = $('<button id = "choose_again" class = "btn btn-warning btn-sm">').text('Choose Again');
    $('.main_body').append(bottom_choices);
    $('#bottom_buttons').append(button1, button2, button3);
    prepare_map();
    my_places = new Places();
    prepare_map();
    var loc = {
        lat: second_location.latitude,
        lng: second_location.longitude
    };
    setCurrentLocation(loc);
    my_places.init(map,loc);
    map.setCenter(loc);
    my_places.search(food_name, loc, direction);
}

function set_direction(position) {
    second_location = position.coords;
    var starting_long = starting_location.longitude;
    var starting_lat = starting_location.latitude;
    var next_long = second_location.longitude;
    var next_lat = second_location.latitude;

    var long_diff = next_long - starting_long;
    var lat_diff = next_lat - starting_lat;

    console.log("Differences " + long_diff, lat_diff);
    //var bearing = Math.tan(long_diff / lat_diff);
    var bearing = Math.atan2(lat_diff,long_diff) * (180 / Math.PI);
    console.log('bearing is '+ bearing);
    if (isNaN(bearing)) {
        return 0;
    }
    return bearing;
}

function view_youtube_ads(button) {//whenever the "other content" button clicked whole page 2 hide and display page3
    console.log('hello');
    $.ajax({
        dataType: 'json',
        method: 'POST',
        data: {
            q: image_array[button].name+" ad USA",
            maxResults: 1,
            type: 'video'
        },
        url: 'https://s-apis.learningfuze.com/hackathon/youtube/search.php',
        success: function (result){
            var iframe = $('<iframe>', {
               "class" : "advertising_video"
                // "src" : "https://www.youtube.com/embed/" + result.video[0].id
        });
            var modal_h4 = $('<h3>',{
                "class" : "modal-title",
                "text":result.video[0].title
            });
            console.log('AJAX Success function called, with the following result:', result);
            //modal area
            $('.modal-body *').remove();
            $('.modal-header h3').remove();
            $('.modal-body').append(iframe);
            $('.modal-header').append(modal_h4);
            autoPlayYouTubeModal("https://www.youtube.com/embed/" + result.video[0].id);
            var test = result.video[0].title;
            console.log('the title is :' + test);
            //modal area
            $("#myModal").on('hide.bs.modal', function(){
                $("iframe").attr('src', '');
            });
        }
    });
}

function autoPlayYouTubeModal(source) {
        var theModal = $('#myModal iframe'),
            videoSRCauto = source + "?autoplay=1";
        $(theModal).attr('src', videoSRCauto);
}
