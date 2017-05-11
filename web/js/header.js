//fait par banquo

//TODO :
// fluidifier l'animation fermante
// gerer le cadre rouge
// permetre la fermeture lorsqu'on clique ailleur sur la page


$(document).ready(function () {
    //animation affichant et refermant le bouton rechercher
    var searchbar = false;

    $('.header-nav #search').click(function showSearchBar() {
        //on commence par fixer la taille du bouton recherche sur sa taille initiale.
        var widthimg = $('.header-nav img').width();
        $('.header-nav img').css("width", widthimg);

        //déplacement des autres boutons vers la droite et la gauche
        $('.header-nav #home-btn').toggle("slide", {direction: 'right'}, 500);
        $('.header-nav .left-menu').toggle("slide", 500, function () { //quant c'est fini,
            //apparition du champs de recherche
            $('.header-nav .search-field').toggle("slide", 200);
            //focus du clavier dans le champs de recherche
            $('.header-nav .search-field').focus();
        });

        //on annonce au reste du script que la searchbar est visible
        searchbar = true ;
    });
//todo : à debugger
//     if ( searchbar ) {
//         $('main').click( showSearchBar() );
//     }
});