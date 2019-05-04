//methode de supression et de réactivation des tooltips :
//un drapeau est mis en place pour ne pas avoir a manipuler le dom trop de fois
//quant on commence, c'est actif
let isRefreshTooltipActive = true
resetTooltips = function () {
    //on verifie si on peut le faire
    if(isRefreshTooltipActive){
        //si c'est bon, on passe l drapeau a false pour annuler les eventuelles requettes redondantes
        isRefreshTooltipActive = false
        $('.tooltipped').tooltip('remove');
        //on réative la fonctionnalité après un cour moment
        Meteor.setTimeout(function () {
            isRefreshTooltipActive =true
        },30)
        //puis on reactive les infobulles apres un delai un poil plus grand, afin que si de nouvelles requettes de tooltips sont faites entre temps, cela ne les oublie pas
        Meteor.setTimeout(function () {
            $('.tooltipped').tooltip({delay: 50})

        }, 100);
    }
    //on enlève les tooltips
}
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

escapeHtml= function (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
