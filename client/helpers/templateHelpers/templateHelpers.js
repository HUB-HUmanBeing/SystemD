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

//prends en entrée soit une durée en ms, soit un objet de type date
Template.registerHelper('formatDuration', function(duration){
    //si c'est pas un nombre (et donc que c'est une date
    if(typeof duration !== 'number'){
        //on calcule la durée
        duration = new Date().getTime() - duration.getTime()
    }
if(duration/9628000000 > 1){
        return "il y a plus d'un mois";
}else if(parseInt(duration/86400000) >=1){
     let plurial = parseInt(duration/86400000)===1?"":"s";
    return  parseInt(duration/86400000) + "jour"+ plurial;
}else if(parseInt(duration/3600000) >=1){
    let plurial = parseInt(duration/3600000)===1?"":"s";
    return  parseInt(duration/3600000) + "heure"+ plurial;
}else if(parseInt(duration/60000) >1){
    let plurial = parseInt(duration/60000)===1?"":"s";
    return parseInt(duration/60000) + "minute"+ plurial;
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
