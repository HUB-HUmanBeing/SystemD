import Competence from '/imports/classes/Competence'
import User from '/imports/classes/User'

Template.editCompetences.helpers({
    //add you helpers here
    hydratedCompetences : function () {
        return Template.instance().hydratedCompetences.get()
    },
    //true si le template est en mode édition
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    //true si il y a eu des opérations faites par l'utilisateur
    isEdited: function () {
        return Template.instance().isEdited.get()
    },
});

Template.editCompetences.events({
    //add your events here
    //lorsque le bouton editer est cliqué
    'click [editCategoriesBtn]': function (event, instance) {
        //on switch le template sur on ou of suivant si on est deja  en mode édition
        instance.isEditing.set(!instance.isEditing.get())
        resetTooltips()
        Meteor.setTimeout(() => {
            let selectedCompetences = []
            instance.hydratedCompetences.get().forEach((item)=>{
                selectedCompetences.push({tag : item.frenchName})
            })
            let autocomplete ={}
            instance.competencesTable.forEach((item)=>{
                autocomplete[item.frenchName] = null
            })

            //on récupere la div des documents non choisis
            $('.chips').material_chip({
                data: selectedCompetences,
                placeholder: 'Ajouter une compétence',
                secondaryPlaceholder: 'Ajouter',
                autocompleteOptions: {
                    data: autocomplete,
                    limit: 5,
                    minLength: 1
                }
            });
            Meteor.setTimeout(()=>{
                $('.chips').on('chip.delete', (e, chip)=>{
                    instance.isEdited = true
                });
                $('.chips').on('chip.add', (e, chip)=>{
                    instance.isEdited = true
                    console.log($('.chips').material_chip('data'))
                    let isRegisteredCompetence= false
                    instance.competencesTable.forEach((item)=>{
                        if(chip.tag === item.frenchName){
                            isRegisteredCompetence = true
                        }
                    })

                });
            },200)
        }, 50)
    },
});

Template.editCompetences.onCreated(function () {

    ///true si on est en mode édition
    this.isEditing = new ReactiveVar(false)
    //true si les catégories ont été éditées
    this.isEdited = new ReactiveVar(false)
    //add your statement here
    this.hydratedCompetences = new ReactiveVar([])
    let CompetenceInstance = new Competence
    CompetenceInstance.callMethod('getCompetencesByLanguage', 'french',(err,result)=> {
        if (!err) {
            let hydratedCompetences = []
            this.competencesTable = result
            this.competencesTable.forEach((competenceItem) => {
                if (Meteor.user().profile.competences.includes(competenceItem.code)) {
                    hydratedCompetences.push(competenceItem)
                }
            })
            this.hydratedCompetences.set(hydratedCompetences)
        }
    })
});

Template.editCompetences.onRendered(function () {
    //add your statement here
});

Template.editCompetences.onDestroyed(function () {
    //add your statement here
});

