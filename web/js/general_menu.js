//
// JS JQUERY DU MENU



$(document).ready(function () {
    var general_menu_is_open = false;
    var initial_color = $('.header-nav img').css("border-color");
    $('.general-menu-btn').click(function () {
        $('.general_menu').toggle("slide", 500);
        //est-ce que c'est ouvert?
        if(general_menu_is_open) {
            //si c'est déja ouvert on le ferme et on change la couleur
            $('#menu-btn img').css("border", initial_color);
            general_menu_is_open = false;
        }
        //si c'est pas encore ouvert
        else {
            $('#menu-btn img').css("border", "4px solid silver");
            general_menu_is_open = true;
        }
    });

    $('.general_menu .sub-menu').hide();
    $('.general_menu .menu-btn').click(function () {
        var sousmenu = $(this).children("ul");
        $(sousmenu).toggle("slide", 500);
        $(this).css("border-color", "grey");
    });
    $('.general_menu img').click(function () {
         $('.sub-menu').hide();
    });
});