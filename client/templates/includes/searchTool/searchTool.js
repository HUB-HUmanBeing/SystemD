import Competence from '/imports/classes/Competence'

Template.searchTool.helpers({
    /***********************************
     * utilitaires du formulaires
     */
    moreSearchTools: function () {
        return Template.instance().moreSearchTools.get()
    },
    validForm: function () {
        return Template.instance().validForm.get()
    },
    /************************
     * gestion de la distance
     *************************/
    //distance a partir de laquelle on retourne les posts
    range: function () {
        return Template.instance().range.get()
    },
    //spécifique a l'affichage, si c'est false, ca
    shownRange: function () {
        return Template.instance().range.get() === 150 ?
            "Rechercher Partout" :
            'à moins de ' + Template.instance().range.get() + 'km'
    },
    rangeCenter : function () {
        return Template.instance().rangeCenter
    },
    /***********************************************
     * gestion du choix de catégories
     */
    categories: function () {
        return CategoryList
    },
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

    byCategories: function () {
        return Template.instance().byCategories.get()
    },
    /****************************************
     * helpeurs liées au choix des compétences
     */
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
    competencesResults: function () {
        return Template.instance().competencesResults.get()
    },
    formattedCompetencesResults: function () {
        let instance = Template.instance()
        let results = instance.competencesResults.get()
        let formattedResults = []
        results.forEach((result, i) => {
            let formattedResult = ""
            instance.competencesCategories.get().forEach((cat) => {
                if (cat.index === result.category) {
                    if (cat.frenchName.length > 13) {
                        formattedResult += cat.frenchName.substring(0, 10) + "... > "
                    } else {
                        formattedResult += cat.frenchName+ " > "
                    }
                }
            })
            if (result.subCategory && result.subCategory !== "all") {
                instance.competencesSubCategories.get().forEach((subCat) => {
                    if (subCat.index === result.subCategory) {
                        if (subCat.frenchName.length > 17) {
                            formattedResult += subCat.frenchName.substring(0, 14) + "... > "
                        } else {
                            formattedResult += subCat.frenchName+ " > "
                        }
                    }
                })
                if (result.competence && result.competence !== "all") {
                    instance.competencesTable.get().forEach((comp) => {
                        if (comp.index === result.competence) {
                            console.log(comp)
                            if (comp.frenchName.length > 20) {
                                formattedResult += comp.frenchName.substring(0, 17) + "... "
                            } else {
                                formattedResult += comp.frenchName
                            }
                        }
                    })
                } else {
                    formattedResult += "Toutes"
                }
            } else {
                formattedResult += "Toutes"
            }
            formattedResults.push({
                index: i,
                content: formattedResult
            })
        })
        return formattedResults
    },
    searchResults : function () {
        return Template.instance().searchResults.get()
    }
});

Template.searchTool.events({
    //add your events here
    //lorsque l'utilisateur modifie la distance
    'change [range]': function (event, instance) {
        //on passe la nouvelle valeur dans la réactive var
        instance.range.set(parseInt($('.range-field input').val()))
    },
    'click [moreSearchTools]': function (event, instance) {
        instance.moreSearchTools.set(true)
        resetTooltips()
    },
    'click [byCategories]': function (event, instance) {
        instance.byCategories.set(!instance.byCategories.get())
        Meteor.setTimeout(() => {
            $('#chosenCategory').material_select();
        }, 100)
    },
    'click [byCompetences]': function (event, instance) {
        instance.byCompetences.set(!instance.byCompetences.get())
        if (instance.byCompetences.get()) {
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
    //au choix de la categorie
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
    'click [addCompetence]': function (event, instance) {
        let competencesResults =instance.competencesResults.get()
        event.preventDefault()
        let toAdd = {
            category: $('#chosenCategory').val(),
            subCategory: $('#chosenSubCategory').val(),
            competence: $('#chosenCompetence').val()?parseInt($('#chosenCompetence').val()):null
        }
        competencesResults.push(toAdd)
        instance.competencesResults.set(competencesResults)
        instance.shownSubCategories.set([])
        instance.shownCompetences.set([])
    },
    'click [clearCompetenceChoice]' : function (event, instance) {
        let results =instance.competencesResults.get()
        let index = event.currentTarget.id
        results.splice(index,1)
        instance.competencesResults.set(results)
    },
    'click [searchBtn]' : function (event, instance) {
        let competences
        if(instance.byCompetences.get()){
            competences = []
            instance.competencesResults.get().forEach((competence)=>{
                if(competence.competence){
                    competences.push([competence.competence])
                }else if(competence.subCategory && competence.subCategory !== 'all'){
                    let toPush = []
                    instance.competencesTable.get().forEach((item)=>{
                       if(competence.subCategory === item.subCategory){
                           toPush.push(item.index)
                       }
                    })
                    competences.push(toPush)
                }else if(competence.category){
                    let toPush = []
                    instance.competencesTable.get().forEach((item)=>{
                        if(competence.category === item.category){
                            toPush.push(item.index)
                        }
                    })
                    competences.push(toPush)
                }
            })
        }
        let categories
        if(instance.byCategories.get()){
            categories = []
            $('#chosenCategory').val().forEach((cat)=>{
                categories.push(parseInt(cat))
            })
        }
        instance.searchOptions = {
            isProject : instance.data.type === "project",
            name : $('#researchedName').val(),
            range : instance.range.get(),
            rangeCenter : instance.rangeCenter,
            categories : categories,
            competences : competences,
        }
        instance.offsetStep = 0
        Meteor.call('searchTool', instance.offsetStep, instance.searchOptions, (err, result)=> {
            if(err){
                console.log(err)
            }else{
                instance.searchResults.set(result)
            }


        })
    },
    'click [moreResults]' : function (event, instance) {
        instance.offsetStep ++
        Meteor.call('searchTool', instance.offsetStep, instance.searchOptions, (err, result)=> {
            if(err){
                console.log(err)
            }else{
                let lastResults = instance.searchResults.get()
                instance.searchResults.set(lastResults.concat(result))
            }


        })
    }
});

Template.searchTool.onCreated(function () {
    //add your statement here
    this.offsetStep = 0
    let range = this.data.callingFrom === "menu" ? 150 : 30;
    if(this.data.callingFrom === "projectMembers"){
        this.rangeCenter = this.data.project.publicInfo.location.lonLat? this.data.project.publicInfo.location.lonLat : null
    }else if(Meteor.userId()){
        this.rangeCenter = Meteor.user().profile.location.lonLat?Meteor.user().profile.location.lonLat:null
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

