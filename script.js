/**
 * Created by sloan on 12/12/2016.
 */
$(document).ready(function(){
    build_page1();
    $('.main_body').on('click','.logos_container div.col-xs-4',function(){
        build_page2($(this).attr('data-imgindex'));
    });
    navigator.geolocation.getCurrentPosition(function(position) {
        starting_location=position.coords;
    });
    $('header').click(build_page1);
});
var starting_location;
var second_location;
var direction;

var image_array = [
    {image: 'burgerking.png',
     name: 'Burger King'},
    {image: 'carls.jpg',
     name: "Carl's Jr."},
    {image: 'deltaco.png',
     name: "Del Taco"},
    {image: 'innout.png',
     name: "In-N-Out Burger"},
    {image: 'jackinthebox.png',
     name: "Jack In The Box"},
    {image: 'kfc.png',
     name: "KFC"},
    {image: 'mcdonalds.png',
     name: "McDonald's"},
    {image: 'tacobell.png',
     name: "Taco Bell"},
    {image: 'wendys.png',
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
    var first_h3 = $('<h3>').text('We will show you locations');
    var second_h3 = $('<h3>').text('in front of you');

    $('.main_body').append(bottom_text);
    $('.textAtBottom').append(only_h1, first_h3, second_h3);
}

function build_page2(button) {
    navigator.geolocation.getCurrentPosition(function (position) {
        direction = set_direction(position);
        build_page2_1(direction, button);
    });
}
function build_page2_1(direction, button) {
    var dpanel = $("<div>",{
        id:"directionsPanel"
    });
    $('.main_body *').remove();
    // $('.textAtBottom').remove();
    var food_name=image_array[button].name;
    var map_container = $('<div id="map">');
    $('.main_body').append(map_container,dpanel);
    var bottom_choices=$('<div id="bottom_buttons">');
    var button1=$('<button id="switch_directions">').text('Switch Direction');
    var button2=$('<button id="other_content">').text('Other Content');
    button2.click(function(){
        console.log('button- '+button);
        view_youtube_ads(button);
    });//add click handler for button2
    var button3=$('<button id="choose_again">').text('Choose Again');
    $('.main_body').append(bottom_choices);
    $('#bottom_buttons').append(button1, button2, button3);
    // $('#bottom_buttons button').click(function(){
    //     console.log(this.id);
    //     switch(this.id) {
    //         case "switch_directions":
    //             switch_directions();
    //             break;
    //         case "other_content":
    //             build_page3();
    //             break;
    //         case "choose_again":
    //             build_page1();
    //             break;
    //     }
    // });
    prepare_map();
    var my_map=new Places();
    var loc = {
        lat: second_location.latitude,
        lng: second_location.longitude
    };
    my_map.init(map,loc);
    map.setCenter(loc);
    my_map.search(food_name, loc);
}


function set_direction(position) {
    second_location = position.coords;
    // var starting_long=starting_location.longitude;
    // var starting_lat=starting_location.latitude;
    // var next_long=second_location.longitude;
    // var next_lat=starting_location.latitude;
    var starting_long=33.630731;
    var starting_lat=-117.743381;
    var next_long=33.633238;
    var next_lat=-117.747019;
    var long_diff=starting_long-next_long;
    var lat_diff=starting_lat-next_lat;
    console.log("Differences "+long_diff,lat_diff);
    var bearing = Math.tan(long_diff / lat_diff);
    console.log('bearing is '+ bearing);
    if (isNaN(bearing)) {
        return 0;
    }
    return bearing;

}

function view_youtube_ads(button) {
    console.log('hello');
    $('.main_body *').remove();
    $('.textAtBottom').remove();
    $.ajax({
        dataType: 'json',
        method: 'POST',
        data: {
            q:image_array[button].name+" ad USA",
            maxResults:1,
            type: 'video'

        },
        url: 'https://s-apis.learningfuze.com/hackathon/youtube/search.php',
        success: function (result) {
            var iframe = $('<iframe>', {
               "class":"advertising_video",//todo:fix some of the logos not working when click for videos.
                "src":"https://www.youtube.com/embed/" + result.video[0].id
        });
            $('.main_body').append(iframe);
            // <iframe width="560" height="315" src="https://www.youtube.com/embed/_UUmpogN-RM" frameborder="0" allowfullscreen></iframe>

            console.log('AJAX Success function called, with the following result:', result);
        }
    });
}


