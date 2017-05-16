/**************************
* JS JQUERY DU MENU
**************************/


$(document).ready(function () {
    //le menu est il ouvert ou fermé
    var general_menu_is_open = false;
    //on récupère la couleur initiale du border du header
    var initial_color = $('.header-nav img').css("border-color");

    /********************************
     * OUVERTURE DU MENU PRINCIPAL
     ********************************/

    $('#menu-btn').click(function () {
        $('.general_menu').toggle("slide", 500);
        //est-ce que c'est ouvert?
        if(general_menu_is_open) {
            //si c'est déja ouvert on le ferme et on change la couleur
            $('.general_menu .menu-icon-btn img').css("border", initial_color);
            general_menu_is_open = false;
        }
        else {
            //si c'est pas encore ouvert, on ouvre et on change la couleur du border
            $('.general_menu .menu-icon-btn img').css("border", "4px solid silver");
            general_menu_is_open = true;
        }
    });
    //le sous menu est hide par défault
    $('.general_menu .sub-menu').hide();

    /*************************
     *OUVERTURE DES SOUS-MENUS
     ****************************/

        //le sous menu s'ouvre quand on clique sur le bouton correspondant
    $('.general_menu .menu-icon-btn').click(function () {
        var sub_menu = $(this).children("ul");
        //si il est déja ouvert on le cache ( = le ul enfant est visible)
        if( $(this).children("ul").is(":visible")) {
            $(sub_menu).hide("slide", 200);
        }
        //sinon on ferme le précedent et on montre le nouveau
        else {
            $('.general_menu .sub-menu').hide(); //cache du précedent
            $(sub_menu).show("slide", 800);//ouverture du nouveau
        }
    });
});