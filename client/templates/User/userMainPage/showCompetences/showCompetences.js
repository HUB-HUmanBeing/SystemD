import Competence from '/imports/classes/Competence'

Template.showCompetences.helpers({
    //add you helpers here
    hydratedCompetences : function () {
        return Template.instance().hydratedCompetences.get()
    }
});

Template.showCompetences.events({
    //add your events here
});

Template.showCompetences.onCreated(function () {
    //add your statement here
    this.hydratedCompetences = new ReactiveVar([])
    let userCompetences = this.data.competences
    let CompetenceInstance = new Competence
CompetenceInstance.callMethod('getCompetencesByLanguage', 'french',(err,result)=>{
    if(!err){
        let hydratedCompetences = []
        result.competences.forEach((competenceItem)=>{
            if(userCompetences.includes(competenceItem.index)){
                hydratedCompetences.push(competenceItem)
            }
        })
        this.hydratedCompetences.set(hydratedCompetences)
    }
})

});

Template.showCompetences.onRendered(function () {
    //add your statement here
});

Template.showCompetences.onDestroyed(function () {
    //add your statement here
});

