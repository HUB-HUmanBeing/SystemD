import Competence from '/imports/classes/Competence'
import User from '/imports/classes/User'

Template.editCompetences.helpers({
    //add you helpers here
    hydratedCompetences: function () {
        return Template.instance().hydratedCompetences.get()
    },
    sortedCompetences: function () {
        resetTooltips()
        return sortCompetences("french",
            Template.instance().hydratedCompetences.get(),
            Template.instance().competencesCategories,
            Template.instance().competencesSubCategories)


    },
    //true si le template est en mode édition
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    //true si il y a eu des opérations faites par l'utilisateur
    isEdited: function () {
        return Template.instance().isEdited.get()
    },
    //POUR LA FENETRE MODALE D'AJOUT DE NOUVELLE COMPETENCE
    //true si on doit afficher la modale d'ajout de compétence
    showAddNewCompetence: function () {
        return Template.instance().showAddNewCompetence.get()
    },
    //tableau des grandes catégories
    competenceCategories: function () {
        return Template.instance().competencesCategories
    },
    //tableau généré dynamiquement en fonction de la categorie choisie
    shownSubCategories: function () {
        return Template.instance().shownSubCategories.get()
    },
    //affiche la nouvelle compétence en cours de réferencement
    newCompetence: function () {
        return Template.instance().newCompetence.get()
    },
    //true si le choix de catégorie et de sous catégorie a été fait
    readyToAddCompetence: function () {
        return Template.instance().readyToAddCompetence.get()
    }
});

Template.editCompetences.events({
    //add your events here
    //lorsque le bouton editer est cliqué
    'click [editCompetencesBtn]': function (event, instance) {
        resetTooltips()
        //on switch le template sur on ou of suivant si on est deja  en mode édition
        instance.isEditing.set(!instance.isEditing.get())
        //on temporise un peu pour laisser le temps a la fenetre modale d'etre insérée dans le dom
        Meteor.setTimeout(() => {
            //on remplit les competences déja selectionnées par l'utilisateur
            let selectedCompetences = []
            instance.hydratedCompetences.get().forEach((item) => {
                selectedCompetences.push({tag: item.frenchName})
            })
            //on crée un objet dans lequel on rentre les differentes possibilités d'autocompletion
            let autocomplete = {}
            instance.competencesTable.forEach((item) => {
                autocomplete[item.frenchName] = null
            })
            //on lance l'outil de materialize des "chips" permettant un affichage sous forme de bulles suprimables
            $('.chips').material_chip({
                data: selectedCompetences,//on lui donne les competences de l'utilisateur
                placeholder: 'Ajouter',//placeholder à afficher
                secondaryPlaceholder: 'Ajouter',
                autocompleteOptions: {//options d'autocomplétion
                    data: autocomplete,//on lui donne l'opbjet crée plus haut
                    limit: 5,
                    minLength: 1
                }
            });
            //puis on attends un peu qu'il gere l'affichage des chips
            Meteor.setTimeout(() => {
                //actions a réaliser au delete d'un chimp
                $('.chips').on('chip.delete', (e, chip) => {
                    instance.isEdited.set(true)//on autorise la sauvegarde
                });
                //a l'ajout d'une nouvelle compétence
                $('.chips').on('chip.add', (e, chip) => {
                    instance.isEdited.set(true)//on autorise la sauvegarde
                    //on regarde ensuite si c'est une compétence réferencée ou non
                    let isInArray = false
                    //on boucle sur celles qu'on connait
                    instance.competencesTable.forEach((item) => {
                        if (chip.tag === item.frenchName) {//si on la trouve on passe le drapeau a true
                            isInArray = true
                        }
                    })
                    //dans le ca ou elle serait pas dans le tableau
                    if (!isInArray) {
                        //on active la fenetre modale d'ajout de compétence
                        instance.showAddNewCompetence.set(true)
                        //on renseigne lae nom de la compétence a ajouter
                        instance.newCompetence.set(chip.tag)
                        //on attend que la modale soit bien dans le dom
                        Meteor.setTimeout(() => {
                            //on l'active
                            $('#addCompetencesModal').modal({
                                endingTop: '4%', // Ending top style attribute
                                complete() {//lorsque la modale se referme
                                    // on verifie si on vient d'ajouter une nouvelle compétence
                                    if (!instance.isNewCompetenceAdded) {//si c'est pas le cas et que l'opération a été annulée
                                        //on vient rechercher le chip a retirer
                                        $('.chips>.chip').each((index, el) => {
                                            let content = $(el).html().split("<")[0]
                                            if (content === chip.tag) {
                                                $(el).children().click()//et on clique sur son bouton de supression
                                            }
                                        })
                                    } else {
                                        //sinon, on repasse la variable à false pour la réinitialiser
                                        instance.isNewCompetenceAdded = false
                                    }
                                }
                            })
                            //puis on ouvre la modale
                            $('#addCompetencesModal').modal('open');
                            //et on active le material select
                            $('select').material_select();
                        }, 50)
                    }
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
            //on récupere la valeur des chips
            let selectedChips = $('.chips').material_chip('data')
            //on boucle dans notre tableau de compétence
            instance.competencesTable.forEach((item) => {
                selectedChips.forEach((chip) => {//on regarde pour chaune des competences sélectionnées
                    if (item.frenchName === chip.tag) {// si la valeur correspond a quelquechose de connu
                        competences.push(parseInt(item.index))//on l'ajoute
                    }
                })
            })
            //on récupere l'utilisateur courant
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
                        instance.isEditing.set(false) //on referme le mode d'edition
                        instance.isEdited.set(false)//on reinitialise
                        //puis on vient reremplir les competences a partir des nouvelles compétences de l'utilisateur
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
    },
    //EVENT DE LA MODALE D'AJOUT DE COMPETENCE
    //au choix de la categorie
    'change [chooseCategory]': function (event, instance) {
        //on récupere la valeur
        let chosenCategory = event.currentTarget.value
        //on trie les sous catégories a afficher
        let shownSubCategories = []
        instance.competencesSubCategories.forEach((subCat) => {
            if (subCat.category === chosenCategory) {
                shownSubCategories.push(subCat)
            }
        })
        //et on les passe dans la réactive var
        instance.shownSubCategories.set(shownSubCategories)
        //puis on reinitialise les selects apres avoir laissé le temps que le second soit dans le dom
        Meteor.setTimeout(() => {
            $('select').material_select();
        }, 50)
    },
    //clorsqu'on choisit une sous catégorie
    'change [chooseSubCategory]': function (event, instance) {
        instance.readyToAddCompetence.set(true)//on active le bouton d'ajout
    },
    //lorsqu'on clique sur le bouton d'ajout d'une nouvelle competence
    'click [addNewCompetence]': function (event, instance) {
        //on vient récuperer toutes les valeurs
        let newCompetenceFrenchName = instance.newCompetence.get();
        let newCompetenceCategory = $('#chosenCategory').val()
        let newCompetenceSubCategory = $('#chosenSubCategory').val()

        //on crée une nouvelle compétence
        let newCompetence = new Competence;
        //on lui attribue les valeurs
        newCompetence.frenchName = newCompetenceFrenchName
        newCompetence.category = newCompetenceCategory
        newCompetence.subCategory = newCompetenceSubCategory
        //puis on appele la methode d'ajout
        newCompetence.callMethod('addNewCompetence', (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                console.log(error)
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                //si tot se passe bien, on vient reset l'affichage des chips avec une nouvelle requete de la table des competences
                let CompetenceInstance = new Competence
                CompetenceInstance.callMethod('getCompetencesByLanguage', 'french', (err, result) => {
                    if (!err) {
                        let hydratedCompetences = []
                        instance.competencesTable = result.competences
                        instance.competencesCategories = result.competencesCategories
                        instance.competencesSubCategories = result.competencesSubCategories
                        instance.competencesTable.forEach((competenceItem) => {
                            if (Meteor.user().profile.competences.includes(competenceItem.index)) {
                                hydratedCompetences.push(competenceItem)
                            }
                        })
                        instance.hydratedCompetences.set(hydratedCompetences)
                    }
                })
                //on passe le drapeau a true
                instance.isNewCompetenceAdded = true
                //on detruit le select
                $('select').material_select('destroy');
                //on réinitialise le tout
                instance.shownSubCategories.set([])
                instance.readyToAddCompetence.set(false)
                instance.showAddNewCompetence.set(false)
                // on avertit l'user et on referme le panneau d'édition
                Materialize.toast("La compétence \"" + newCompetenceFrenchName + '" a été ajoutée', 6000, 'green')
                $('#addCompetencesModal').modal('close');
            }
        })
    }
});

Template.editCompetences.onCreated(function () {

    ///true si on est en mode édition
    this.isEditing = new ReactiveVar(false)
    //true si les catégories ont été éditées
    this.isEdited = new ReactiveVar(false)
    //liste des compétences utilisateur hydratée par les données de la base
    this.hydratedCompetences = new ReactiveVar([])
    //on cree une instance de competence pour rpouvoir apeller la methode
    let CompetenceInstance = new Competence
    CompetenceInstance.callMethod('getCompetencesByLanguage', 'french', (err, result) => {
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
            //puis on les transmet a la réactive var
            this.hydratedCompetences.set(hydratedCompetences)
        }
    })
    //initialisation des autres réactives var
    this.newCompetence = new ReactiveVar("")
    this.showAddNewCompetence = new ReactiveVar(false)
    this.shownSubCategories = new ReactiveVar([])
    this.readyToAddCompetence = new ReactiveVar(false)
});

Template.editCompetences.onRendered(function () {
    //add your statement here
});

Template.editCompetences.onDestroyed(function () {
    //add your statement here
    $('select').material_select('destroy');
});