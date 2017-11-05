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
    return number<=1 ? " " :number;
})

Template.registerHelper('onlyZeroToNine', function(number){
    return number>9? "+" :number;
})

Template.registerHelper('formatDuration', function(duration){
    if(duration<900000){//15min
        return "quelques minutes"
    }else if(duration<3600000){ //1h
        return "moins d'une heure"
    }else if(duration<86400000){ //jour
        return "moins d'un jour"
    }else if(duration<604800000){ //une semaine
        return "moins d'une semaine"
    }else if(duration<9628000000){ //un mois
        return "moins d'un mois"
    }
})
