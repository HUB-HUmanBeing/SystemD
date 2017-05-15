$(document).ready(function () {
    $('.general-menu-btn').click(function () {
        $('.general_menu').toggle("slide", 500);
    });
    $('.menu-btn').click(function () {
        $( '.sub-menu').toggle("slide", 500);
    });
});