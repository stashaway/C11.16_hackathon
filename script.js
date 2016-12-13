/**
 * Created by sloan on 12/12/2016.
 */
$(document).ready(function(){
    build_page1();
    $('.logos_container div').click(function(){
        build_page2($(this).attr('data-imgindex'));
    });
    // $('#other_content').click(view_youtube_ads);
});

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

    $('body').append(bottom_text);
    $('.textAtBottom').append(only_h1, first_h3, second_h3);
}

function build_page2(button){
    $('.main_body *').remove();
    $('.textAtBottom').remove();
    var food_name=image_array[button].name;
    // console.log(food_name);
    var map_container = $('<div id="map">');
    $('.main_body').append(map_container);
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
    prepare_map();
    var my_map=new Places();
    my_map.init(map);
    var loc = new google.maps.LatLng(33.6361934,-117.7415816);
    map.setCenter(loc);
    my_map.search(food_name, loc);
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
            maxResults:1
        },
        url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
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





