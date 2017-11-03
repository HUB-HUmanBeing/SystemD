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
