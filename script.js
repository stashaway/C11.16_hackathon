/**
 * Created by sloan on 12/12/2016.
 */
function create_page2(){
    $(#main_body *).remove();
    var map_container = $('<div id="map">');
    $(#main_body).append(map_container);
    var bottom_choices=$('<div id="bottom_buttons">');
    var button1=$('<button id="switch_directions">');
    var button2=$('<button id="other_content">');
    var button3=$('<button id="choose_again">');
    $('#main_body').append(bottom_choices);
    $('#bottom_buttons').append(button1, button2, button3);
}


