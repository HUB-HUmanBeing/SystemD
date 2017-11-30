import Competence from '/imports/classes/Competence'

Template.searchTool.helpers({
    /***********************************
     * utilitaires du formulaires
     */
    //true => ouverture du panneau de recherche avancée
    moreSearchTools: function () {
        return Template.instance().moreSearchTools.get()
    },
    /************************
     * gestion de la distance
     *************************/
    //distance a partir de laquelle on retourne les resultats
    range: function () {
        return Template.instance().range.get()
    },
    //spécifique a l'affichage renvoie partout si c'est égal à 150
    shownRange: function () {
        return Template.instance().range.get() === 150 ?
            "Rechercher Partout" :
            'à moins de ' + Template.instance().range.get() + 'km'
    },
    //si yen a un on doit afficher le curseur
    rangeCenter: function () {
        return Template.instance().rangeCenter
    },
    /***********************************************
     * gestion du choix de catégories
     */
    //liste des catégories telle qu'elle est définie dans le tableau catégoryList
    categories: function () {
        return CategoryList
    },
    //liste des categories à préselectionner
    ownerCategories: function () {
        let ownerCategories = []
        let owner = Template.instance().data.callingFrom
        if (owner === "userProjects") {
            ownerCategories = Meteor.user().profile.categories
        } else if (owner === "projectMembers") {
            ownerCategories = Template.instance().data.project.publicInfo.categories
        }
        return ownerCategories
    },
    //true=> ouverture du panneau par catégories
    byCategories: function () {
        return Template.instance().byCategories.get()
    },
    /****************************************
     * helpeurs liées au choix des compétences
     */
    //true=> ouverture du panneau de choix de compétence
    byCompetences: function () {
        return Template.instance().byCompetences.get()
    },
    //tableau des grandes catégories
    competenceCategories: function () {
        return Template.instance().competencesCategories.get()
    },
    //tableau généré dynamiquement en fonction de la categorie choisie
    shownSubCategories: function () {
        return Template.instance().shownSubCategories.get()
    },
    //tableau généré dynamiquement en fonction de la sous-categorie choisie
    shownCompetences: function () {
        return Template.instance().shownCompetences.get()
    },
    //tableau des competences selectionnées par l'utilisateur faisant la recherche
    competencesResults: function () {
        return Template.instance().competencesResults.get()
    },
    // formattage des competences sélectionnées pour l'affichage
    formattedCompetencesResults: function () {
        let instance = Template.instance()
        let results = instance.competencesResults.get()
        //on prepare notre tableau qui sera retourné
        let formattedResults = []
        //pour chacunes des competences
        results.forEach((result, i) => {
            //on initialise le resultat
            let formattedResult = ""
            //on boucle dans les catégories de competences
            instance.competencesCategories.get().forEach((cat) => {
                if (cat.index === result.category) {//quant ca match
                    //on concatene le resultat a ntre chaine , eventuellement troqué a 13 caractères
                    if (cat.frenchName.length > 13) {
                        formattedResult += cat.frenchName.substring(0, 10) + "... > "
                    } else {
                        formattedResult += cat.frenchName + " > "
                    }
                }
            })
            //si une sous catégorie a été choisie
            if (result.subCategory && result.subCategory !== "all") {
                //on boucle dans le tableau des sous-catégories
                instance.competencesSubCategories.get().forEach((subCat) => {
                    //on concatene le resultat a ntre chaine , eventuellement troqué a 17 caractères
                    if (subCat.index === result.subCategory) {
                        if (subCat.frenchName.length > 17) {
                            formattedResult += subCat.frenchName.substring(0, 14) + "... > "
                        } else {
                            formattedResult += subCat.frenchName + " > "
                        }
                    }
                })
                //si une competence particulière a été choisie
                if (result.competence && result.competence !== "all") {
                    //on boucle dans la table des competences
                    instance.competencesTable.get().forEach((comp) => {
                        //on concatene le resultat a ntre chaine , eventuellement troqué a 13 caractères
                        if (comp.index === result.competence) {
                            if (comp.frenchName.length > 20) {
                                formattedResult += comp.frenchName.substring(0, 17) + "... "
                            } else {
                                formattedResult += comp.frenchName
                            }
                        }
                    })
                } else {//si pas de competences particulières choisie
                    formattedResult += "Toutes"
                }
            } else {  //si pas de sous catégories
                formattedResult += "Toutes"
            }
            //on ajoute notre chaine de caractères a notre tableau resultat
            formattedResults.push({
                index: result.index,
                content: formattedResult
            })
        })
        //on renvoie le tableau de resultat
        return formattedResults
    },
    //renvoie un tableau d'objet resultats avec pour chacuns l'id et la distance relative
    searchResults: function () {
        return Template.instance().searchResults.get()
    },
    //affichage ou non du bouton permettant d'afficher plus de résultats
    showMoreResults: function () {
        return Template.instance().showMoreResults.get()
    },
    //afichage ou non de l'info permettant de signaler a l'utilisateur que sa recherche n'a pas de resultats
    noResult: function () {
        return Template.instance().noResult.get()
    }
});

Template.searchTool.events({
    //add your events here
    //lorsque l'utilisateur modifie la distance
    'change [range]': function (event, instance) {
        //on passe la nouvelle valeur dans la réactive var
        instance.range.set(parseInt($('#search-range').val()))
    },
    //au click sur recherche avancé
    'click [moreSearchTools]': function (event, instance) {
        //on change la réactive var
        instance.moreSearchTools.set(true)
        resetTooltips()
    },
    //au click sur recherche par catégories
    'click [byCategories]': function (event, instance) {
        instance.byCategories.set(!instance.byCategories.get())
        Meteor.setTimeout(() => {//on active le select apres avoir lui avoir laissé le temps de se mettre dans le dom
            $('#chosenCategory').material_select();
        }, 100)
    },
    //au click sur recherche par compétence
    'click [byCompetences]': function (event, instance) {
        //on toggle la reactive var
        instance.byCompetences.set(!instance.byCompetences.get())
        //si ca vient de s'ouvrir et qu'on a pas encore récuperé les compétences
        if (instance.byCompetences.get() && !instance.competencesTable.get().length) {
            //on récupère les competences via une requete
            let CompetenceInstance = new Competence
            CompetenceInstance.callMethod('getCompetencesByLanguage', 'french', (err, result) => {
                if (!err) {//si ya pas d'erreur dans la requete
                    //on recupere les resultats pour les mettres dans l'instance et pouvoir les recuperer plus tard
                    instance.competencesTable.set(result.competences)
                    instance.competencesCategories.set(result.competencesCategories)
                    instance.competencesSubCategories.set(result.competencesSubCategories)
                }
                Meteor.setTimeout(() => {
                    $('select').material_select();
                    Materialize.updateTextFields();
                }, 100)
            })
        } else if (instance.byCompetences.get()) {
            Meteor.setTimeout(() => {
                $('select').material_select();
                Materialize.updateTextFields();
            }, 100)
        }
    },
    //au choix de la categorie
    'change [chooseCategory]': function (event, instance) {
        //on récupere la valeur
        let chosenCategory = event.currentTarget.value
        //on trie les sous catégories a afficher
        let shownSubCategories = []
        instance.competencesSubCategories.get().forEach((subCat) => {
            if (subCat.category === chosenCategory) {
                shownSubCategories.push(subCat)
            }
        })
        //et on les passe dans la réactive var
        instance.shownSubCategories.set(shownSubCategories)
        //puis on reinitialise les selects apres avoir laissé le temps que le second soit dans le dom
        Meteor.setTimeout(() => {
            $('select').material_select();
            Materialize.updateTextFields();
        }, 50)
    },
    //au choix de la sous-categorie
    'change [chooseSubCategory]': function (event, instance) {
        //on récupere la valeur
        let chosenSubCategory = event.currentTarget.value
        //on trie les sous catégories a afficher
        let shownCompetences = []
        instance.competencesTable.get().forEach((comp) => {
            if (comp.subCategory === chosenSubCategory) {
                shownCompetences.push(comp)
            }
        })
        //et on les passe dans la réactive var
        instance.shownCompetences.set(shownCompetences)
        //puis on reinitialise les selects apres avoir laissé le temps que le second soit dans le dom
        Meteor.setTimeout(() => {
            $('select').material_select();
            Materialize.updateTextFields();
        }, 50)
    },
    //a l'ajout de la competence choisie
    'click [addCompetence]': function (event, instance) {
        //on récupere les competences déja choisies
        let competencesResults = instance.competencesResults.get()
        event.preventDefault()
        //on récupere les valeurs des inputs selects que l'on insere dans un objet
        let chosenCategory = $('#chosenCategory');
        let toAdd = {
            index : competencesResults.length?competencesResults[competencesResults.length-1].index +1 :0 ,
            category: chosenCategory.val(),
            subCategory: $('#chosenSubCategory').val(),
            competence: $('#chosenCompetence').val() ? parseInt($('#chosenCompetence').val()) : null
        }
        // on le push dans le tableau de resultats
        competencesResults.push(toAdd)
        //on le rentre dans la réactive var
        instance.competencesResults.set(competencesResults)
        //on reinitialise les inputs
        chosenCategory.val("");
        chosenCategory.prop('selectedIndex', 0);
        chosenCategory.material_select();
        instance.shownSubCategories.set([])
        instance.shownCompetences.set([])
    },
    //à la suppression d'un critère de competence
    'click [clearCompetenceChoice]': function (event, instance) {
        //on recupere le tableau de résultats
        let results = instance.competencesResults.get()
        //on recupere l'id de la div cliqué
        let index = parseInt(event.currentTarget.id.split("-")[1])
        //et on retire du tableau l'index correspondant
        results.forEach((result)=>{
            if( result.index === index){
                results.splice(index, 1)
        }
        })

        instance.competencesResults.set(results)
    },
    'click [searchBtn], submit [searchForm]': function (event, instance) {
        event.preventDefault()
        let competences
        if (instance.byCompetences.get()) {
            competences = []
            instance.competencesResults.get().forEach((competence) => {
                if (competence.competence) {
                    competences.push([competence.competence])
                } else if (competence.subCategory && competence.subCategory !== 'all') {
                    let toPush = []
                    instance.competencesTable.get().forEach((item) => {
                        if (competence.subCategory === item.subCategory) {
                            toPush.push(item.index)
                        }
                    })
                    competences.push(toPush)
                } else if (competence.category) {
                    let toPush = []
                    instance.competencesTable.get().forEach((item) => {
                        if (competence.category === item.category) {
                            toPush.push(item.index)
                        }
                    })
                    competences.push(toPush)
                }
            })
        }
        let categories
        if (instance.byCategories.get()) {
            categories = []
            $('#chosenCategory').val().forEach((cat) => {
                categories.push(parseInt(cat))
            })
        }
        instance.searchOptions = {
            isProject: instance.data.type === "project",
            name: $('#researchedName').val(),
            range: instance.range.get(),
            rangeCenter: instance.rangeCenter,
            categories: categories,
            competences: competences,
        }
        instance.offsetStep = 0
        Meteor.call('searchTool', instance.offsetStep, instance.searchOptions, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                instance.searchResults.set(result)
                result.length < 5 ? instance.showMoreResults.set(false) : instance.showMoreResults.set(true)
                if (instance.offsetStep === 0 && result.length === 0) {
                    instance.noResult.set(true)
                } else {
                    instance.noResult.set(false)
                }

            }


        })
    },
    'click [moreResults]': function (event, instance) {
        instance.offsetStep++
        Meteor.call('searchTool', instance.offsetStep, instance.searchOptions, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                let lastResults = instance.searchResults.get()
                instance.searchResults.set(lastResults.concat(result))
                result.length < 5 ? instance.showMoreResults.set(false) : instance.showMoreResults.set(true)
                if (instance.offsetStep === 0 && result.length === 0) {
                    instance.noResult.set(true)
                } else {
                    instance.noResult.set(false)
                }
            }


        })
    }
});

Template.searchTool.onCreated(function () {
    //add your statement here
    this.offsetStep = 0
    let range = this.data.callingFrom === "menu" ? 150 : 30;
    if (this.data.callingFrom === "projectMembers") {
        this.rangeCenter = this.data.project.publicInfo.location.lonLat ? this.data.project.publicInfo.location.lonLat : null
    } else if (Meteor.userId()) {
        this.rangeCenter = Meteor.user().profile.location.lonLat ? Meteor.user().profile.location.lonLat : null
    }
    this.range = new ReactiveVar(range);
    this.moreSearchTools = new ReactiveVar(this.data.callingFrom !== "menu");
    this.byCategories = new ReactiveVar(false)
    this.byCompetences = new ReactiveVar(false)
    this.validForm = new ReactiveVar(true)
    this.competencesTable = new ReactiveVar([])
    this.competencesCategories = new ReactiveVar([])
    this.competencesSubCategories = new ReactiveVar([])
    this.shownSubCategories = new ReactiveVar([])
    this.shownCompetences = new ReactiveVar([])
    this.competencesResults = new ReactiveVar([])
    this.searchResults = new ReactiveVar([])
    this.showMoreResults = new ReactiveVar(false)
    this.noResult = new ReactiveVar(false)
});

Template.searchTool.onRendered(function () {
    //add your statement here
    $('#chosenCategory').material_select();
    Meteor.setTimeout(() => {
        Materialize.updateTextFields();
        resetTooltips()
        $('select').material_select();
    }, 150)

});

Template.searchTool.onDestroyed(function () {
    $('#chosenCategory').material_select('destroy');
});

