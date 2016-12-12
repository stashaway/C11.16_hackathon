/**
 * Created by sloan on 12/12/2016.
 */
$(document).ready(function(){
    // header();

    // create_image();
    build_page1();
});

// function header(){
//     var h1 = $('<h1>', {
//         "text":'Find Food Fast'
// });
//     $('header').append (h1);
// }
var image_array = ['burgerking.png','carls.jpg','deltaco.png','innout.png','jackinthebox.png','kfc.png','mcdonalds.png','tacobell.png','wendys.png'];



function build_page1 () {
    var div_container = $('<div>',{
        "class":"logos_container"
    });
    $('.main_body').append(div_container); //append container div into Main body
    var count = 1;
    for (var i=0; i<3; i++) {
        var div_row = $('<div>',{ //created container div
            "class":"row"
        });
        $(div_container).append(div_row); //append div row into div container
        for (var j=0; j<3; j++){
                var div_columns = $('<div>',{// created 3 div with class of "row"
                "class":"col-xs-4",
                "id":"img" + count++
            });
                $(div_row).append(div_columns);
        }
    }
    for (var i = 0; i < image_array.length; i++) {

        var img = $("<img>", {
            "src": "images/" + image_array[i],
            "class": "img-circle"
        });
        $('#img' + (i + 1)).append(img);//append each image into row html

    }
    var bottom_text = $('<div>',{
        "class":"textAtBottom"
    });
    var only_h1 = $('<h1>').text('Choose some food!');
    var first_h3 = $('<h3>').text('We will show you locations');
    var second_h3 = $('<h3>').text('in front of you');

    $('body').append(bottom_text);
    $('.textAtBottom').append(only_h1,first_h3,second_h3);
}


