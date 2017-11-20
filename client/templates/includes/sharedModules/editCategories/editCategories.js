import User from '/imports/classes/User';
import Project from '/imports/classes/Project';
import Sortable from 'sortablejs';

//documentation pour sortable : https://github.com/RubaXa/Sortable

Template.editCategories.helpers({
    //true si le template est en mode édition
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    //liste des catégories de l'utilisateur(initialement)
    categories: function () {
        return Template.instance().categories
    },
    //liste des catégories non-choisies par l'utilisateur (initialement)
    unchosenCategories: function () {
        return Template.instance().unchosenCategories
    },
    //true si il y a eu des opérations faites par l'utilisateur
    isEdited: function () {
        return Template.instance().isEdited.get()
    },
    //nom a donner suivant l'endroit ou le template est appelé
    categoriesLabel: function () {
        return Template.instance().isProject ? "types d'activités" : "centres d'interets"
    },
    //couleur du label suivant l'endroit ou le template est appelé
    categoriesLabelColor: function () {
        return Template.instance().isProject ? "orange" : "green"
    }

});

Template.editCategories.events({
    //lorsque le bouton editer est cliqué
    'click [editCategoriesBtn]': function (event, instance) {
        //on switch le template sur on ou of suivant si on est deja  en mode édition
        instance.isEditing.set(!instance.isEditing.get())
        resetTooltips()
        Meteor.setTimeout(() => {
            //on récupere la div des documents non choisis
            let unchosenCategories = document.getElementById("unchosenCategories")
            //on active le tri par glisser deposer
            this.unchosen = Sortable.create(unchosenCategories, {
                group: {
                    name: "unchosenCategories",  // or { name: "...",
                    put: ['chosenCategories'] //on peut faire rentrer dedans les catégories déja choisies
                },
                sort: false,//elles doivent pas se trier elles memes au drag and drop
                onMove() {//quant il y a déplacement
                    resetTooltips()
                    instance.isEdited.set(true)
                },
                animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
            });
            //on recupere le conteneur des catégories choisies
            let chosenCategories = document.getElementById("chosenCategories")
            //et on lance sur lui aussi la propriété de drag and drop
            this.chosen = Sortable.create(chosenCategories, {
                group: {
                    name: "chosenCategories",  // or { name: "...",
                    put: ['unchosenCategories']
                },
                onMove() {//quaant il y a déplacement
                    resetTooltips()
                    instance.isEdited.set(true)
                },
                sort: true,  // sorting inside list
                animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
            });
        }, 300)
    },
    //lorsqu'on clique sur sauvegarder todo : ca marche pas que la sauvegarde se fasse au focus out
    'click [saveCategoriesBtn], focusout #editCategories': function (event, instance) {
        //si le template a bien été édité
        if (instance.isEdited.get() === true) {
            //on récupere la bonne méthode
            let methodToCall = instance.isProject ? "updateInfoItem" : "updateProfileItem";
            //on récupere les catégories directement dans le html
            let categories = [];
            $("#chosenCategories li").each((i, el) => {//on les récupere toute et pour chacunes
                let id = el.getAttribute('id');//on prends leur id
                let category = parseInt(id.split('-')[1]);//on garde que la fin
                categories.push(category);//on les rentre dans le tableau des catégories a ajouter
            });
            //puis on appelle la méthode
            instance.owner.callMethod(
                methodToCall,
                "categories",
                categories,
                (error) => {
                    //si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        console.log(error)
                        Materialize.toast("une erreur s'est produite", 4000, 'red')
                    } else {
                        //si tout est bon, on avertit l'user et on referme le panneau d'édition
                        let message = instance.isProject ? "Les types d'activités du projet " : "Vos centres d'interets"
                        Materialize.toast(message + "ont été mise à jour", 6000, 'green')
                        instance.isEditing.set(false)
                        instance.isEdited.set(false)
                    }
                })
        }

    }
});

Template.editCategories.onCreated(function () {
    //true si c'est un projet
    this.isProject = Template.currentData().owner === "project"
    //id du projet ou de l'utilisateur courant
    this.id = this.isProject ? Template.currentData().projectId : Meteor.userId()
    //instance de la classe user ou projet qui beneficie du template
    this.owner = this.isProject ? Project.findOne({_id: this.id}) : User.findOne({_id: this.id})
    //true si on est en mode édition
    this.isEditing = new ReactiveVar(false)
    //true si les catégories ont été éditées
    this.isEdited = new ReactiveVar(false)
    //catégories presentes dans la table de l'utilisateur
    this.categories = this.isProject ? this.owner.publicInfo.categories : this.owner.profile.categories
    //catégories absentes
    this.unchosenCategories = []
    CategoryList.forEach((categoryObject, i) => {
        if (!this.categories.includes(parseInt(categoryObject.id))) {
            this.unchosenCategories.push(i)
        }
    })
});

Template.editCategories.onRendered(function () {
    //add your statement here
    resetTooltips();

});

Template.editCategories.onDestroyed(function () {
    //add your statement here
    resetTooltips();
});

