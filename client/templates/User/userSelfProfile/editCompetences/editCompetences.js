import Competence from '/imports/classes/Competence'
import User from '/imports/classes/User'

Template.editCompetences.helpers({
    //add you helpers here
    hydratedCompetences: function () {
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
    showAddNewCompetence : function () {
      return Template.instance().showAddNewCompetence.get()
    },
    competenceCategories : function () {
        return []
    },
    competenceSubCategories : function () {
        return []
    }
});

Template.editCompetences.events({
    //add your events here
    //lorsque le bouton editer est cliqué
    'click [editCompetencesBtn]': function (event, instance) {
        //on switch le template sur on ou of suivant si on est deja  en mode édition
        instance.isEditing.set(!instance.isEditing.get())
        resetTooltips()
        Meteor.setTimeout(() => {
            let selectedCompetences = []
            instance.hydratedCompetences.get().forEach((item) => {
                selectedCompetences.push({tag: item.frenchName})
            })
            let autocomplete = {}
            instance.competencesTable.forEach((item) => {
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
            Meteor.setTimeout(() => {
                $('.chips').on('chip.delete', (e, chip) => {
                    instance.isEdited.set(true)
                });
                $('.chips').on('chip.add', (e, chip) => {
                    instance.isEdited.set(true)
                    let isRegisteredCompetence = false
                    instance.competencesTable.forEach((item) => {
                        if (chip.tag === item.frenchName) {
                            isRegisteredCompetence = true
                        }
                    })
                    instance.showAddNewCompetence.set(true)
                    Meteor.setTimeout(()=>{
                        $('#addCompetencesModal').modal();
                        $('#addCompetencesModal').modal('open');
                        $('select').material_select();
                    },50)
                });
            }, 200)
        }, 50)
    },
    //lorsqu'on clique sur sauvegarder todo : ca marche pas que la sauvegarde se fasse au focus out
    'click [saveCompetencesBtn]': function (event, instance) {
        //si le template a bien été édité
        if (instance.isEdited.get() === true) {

            //on récupere les catégories directement dans le html
            let competences = [];
            let selectedChips = $('.chips').material_chip('data')
            instance.competencesTable.forEach((item) => {
                selectedChips.forEach((chip) => {
                    if(item.frenchName===chip.tag){
                        competences.push(parseInt(item.index))
                    }
                })
            })
            let currentUser = User.findOne({_id: Meteor.userId()})
            //puis on appelle la méthode
            currentUser.callMethod(
                "updateProfileItem",
                "competences",
                competences,
                (error) => {
                    //si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        console.log(error)
                        Materialize.toast("une erreur s'est produite", 4000, 'red')
                    } else {
                        //si tout est bon, on avertit l'user et on referme le panneau d'édition
                        Materialize.toast("Vos competences ont été mise à jour", 6000, 'green')
                        instance.isEditing.set(false)
                        instance.isEdited.set(false)
                        let hydratedCompetences = []

                        instance.competencesTable.forEach((competenceItem) => {
                            if (Meteor.user().profile.competences.includes(competenceItem.index)) {
                                hydratedCompetences.push(competenceItem)
                            }
                        })
                        instance.hydratedCompetences.set(hydratedCompetences)
                    }
                })
        }

    }
});

Template.editCompetences.onCreated(function () {

    ///true si on est en mode édition
    this.isEditing = new ReactiveVar(false)
    //true si les catégories ont été éditées
    this.isEdited = new ReactiveVar(false)
    //add your statement here
    this.hydratedCompetences = new ReactiveVar([])
    let CompetenceInstance = new Competence
    CompetenceInstance.callMethod('getCompetencesByLanguage', 'french', (err, result) => {
        if (!err) {
            let hydratedCompetences = []
            this.competencesTable = result
            this.competencesTable.forEach((competenceItem) => {
                if (Meteor.user().profile.competences.includes(competenceItem.index)) {
                    hydratedCompetences.push(competenceItem)
                }
            })
            this.hydratedCompetences.set(hydratedCompetences)
        }
    })
    this.showAddNewCompetence = new ReactiveVar(false)
});

Template.editCompetences.onRendered(function () {
    //add your statement here
});

Template.editCompetences.onDestroyed(function () {
    //add your statement here
});

