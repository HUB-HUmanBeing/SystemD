Template.registerHelper('completedColor', function(completed){
    if(completed <=25){
        return "red"
    }else if(completed <= 75){
        return "orange"
    }else{
        return "green"
    }
})

Template.registerHelper('length', function(array){
        return array.length
})

Template.registerHelper('localeDate', function(date){
    return date.toLocaleDateString()
})

Template.registerHelper('nullIfOne', function(number){
    return number<=1 ? "" : number+ " - ";
})

Template.registerHelper('onlyZeroToNine', function(number){
    return number>9? "+" :number;
})
Template.registerHelper('indexEq', function(index, length){
    return index === length - 1
})
Template.registerHelper('xl', function(){
    let valeur_clientWidth = document.body.clientWidth;
    return valeur_clientWidth >1284
})
//prends en entrée soit une durée en ms, soit un objet de type date
Template.registerHelper('formatDuration', function(duration){
    //si c'est pas un nombre (et donc que c'est une date
    if(typeof duration !== 'number'){
        //on calcule la durée
        duration = new Date().getTime() - duration.getTime()
    }
if(duration/9628000000 > 1){
        return "plus d'un mois";
}else if(parseInt(duration/86400000) >=1){
     let plurial = parseInt(duration/86400000)===1?"":"s";
    return  parseInt(duration/86400000) + " jour"+ plurial;
}else if(parseInt(duration/3600000) >=1){
    let plurial = parseInt(duration/3600000)===1?"":"s";
    return  parseInt(duration/3600000) + " heure"+ plurial;
}else if(parseInt(duration/60000) >1){
    let plurial = parseInt(duration/60000)===1?"":"s";
    return parseInt(duration/60000) + " minute"+ plurial;
}else{
    return 'quelques secondes'
}
})

//renvoie la couleur associée au type
Template.registerHelper('colorByType', function(type){
    if( type === "project"){
        return "orange"
    }else if( type === "user"){
        return "green"
    }
})


Template.registerHelper('isInArray', function(element, array){
    return array.includes(element)
})
Template.registerHelper('showDistance', function(distance) {

//distance relative
    if (!distance && distance !== 0) {
        distance = ""
    } else if (distance <= 1) {
        distance = "moins de 2 km"
    } else {
        distance = distance + " km"
    }
    return distance
})

Template.registerHelper('relativeDistanceFromCoord', function (lonLat) {
    let relativeDistance = ""
    if (Meteor.userId()) {
        const currentUserLocation = Meteor.user().profile.location
        if (lonLat && currentUserLocation.lonLat) {
            let distance = calculateDistance(
                lonLat,
                currentUserLocation.lonLat
            );
            let distanceToShow = parseInt(distance.kilometers)<2? "moins de 2" :parseInt(distance.kilometers)
            relativeDistance = "("+ distanceToShow +"km )"
        }
    }
    return relativeDistance
})

Template.registerHelper('isArray', function (el) {
    return Array.isArray(el)
})


// Test Translation universe:i18n
Template.registerHelper('enTranslate', function (){
    return {
            aim:i18n.__('navbar.aims'),
            feature:i18n.__('navbar.features'),
            roadMap:i18n.__('navbar.roadMap'),
            contact:i18n.__('navbar.contact'),
            logIn:i18n.__('navbar.login'),
            signUp:i18n.__('navbar.signUp'),
            logOut:i18n.__('navbar.logout')
            }
})