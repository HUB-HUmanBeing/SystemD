//JAVASCRIPT RELATIF AU HEADER PRINCIPAL

$(document).ready(function () {
    //permet l'animation du header
    var myElement = document.querySelector(".general-header");

    var headroom = new Headroom(myElement);
    headroom.init();

    //Comportement quant on clique sur le hamburger
    var is_hidden = true; //petit flag permettant de voir si le menu est visible
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