resetTooltips = function () {
    //on enlève les tooltips
    $('.tooltipped').tooltip('remove');
    //puis on reactive les infobulles apres un delai
    Meteor.setTimeout(function () {
        $('.tooltipped').tooltip({delay: 50})
    }, 50);
}