//fait par banquo
// grab an element
$(document).ready(function () {
    var myElement = document.querySelector(".general-header");
    // construct an instance of Headroom, passing the element
    var headroom = new Headroom(myElement);
    headroom.init();
    var is_hidden = true;
    $('#general-menu-hamburger').click(function () {

        if(is_hidden) {
            $('#general-menu').css("display", "none").removeClass("hidden-xs")
                .slideDown();
            is_hidden = false;
        } else {
            $('#general-menu').slideUp();
            is_hidden = true;
        }
    });

});