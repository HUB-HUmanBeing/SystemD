Template.registerHelper('completedColor', function(completed){
    if(completed <=25){
        return "red"
    }else if(completed <= 75){
        return "orange"
    }else{
        return "green"
    }
})