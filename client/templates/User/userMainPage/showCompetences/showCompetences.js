import Competence from '/imports/classes/Competence'

Template.showCompetences.helpers({
    //
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
    if (!err) {//si ya pas d'erreur dans la requete
        let hydratedCompetences = []
        //on recupere les resultats pour les mettres dans l'instance et pouvoir les recuperer plus tard
        this.competencesTable = result.competences
        this.competencesCategories = result.competencesCategories
        this.competencesSubCategories = result.competencesSubCategories
        //on boucle sur le tableau de competence
        this.competencesTable.forEach((competenceItem) => {
            //si elles sont dans les competences de l'user,
            if (Meteor.user().profile.competences.includes(competenceItem.index)) {
                //on les enregistre dans le tableau
                hydratedCompetences.push(competenceItem)
            }
        })
        this.hydratedCompetences.set(hydratedCompetences)
        console.log(sortCompetences("french",hydratedCompetences ,this.competencesCategories, this.competencesSubCategories ))
    }
})

});

Template.showCompetences.onRendered(function () {
    //add your statement here
});

Template.showCompetences.onDestroyed(function () {
    //add your statement here
});

