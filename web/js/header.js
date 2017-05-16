//fait par banquo

var searchbar = false;     // = la searchbar est elle active?
function closesearch() {
    $('.header-nav .search-field').toggle("slide", 200, function () { //quant c'est fini,
        //on fait réaparaitre les autres boutons
        $('.header-nav .left-menu').toggle("slide", 500);
        setTimeout(function () {
            $('.header-nav #home-btn').toggle("slide", {direction: 'right'}, 400);
        }, 200);
        //on annonce au reste du script que la searchbar est cachée
        searchbar = false;
    });
}

$(document).ready(function () {
    //animation affichant et refermant le bouton rechercher


    $('.header-nav #open-search').click(function () {
        if(!searchbar) {
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
                //on annonce au reste du script que la searchbar est visible
                searchbar = true ;
            });
        }
        else{
            //si ya quelquechose dedans on envoie le formulaire
            if($('.search-field').val() !== ""){
                $('#search').submit();
            }
            else {
                //sinon on le referme
                closesearch();
            }
        }
    });
    //on peut aussi refermer le formulaire de recherche en cliquant n'importe ou ailleurs
    $('main').click(function () {
        if(searchbar){
            closesearch();
        }

    })
});
