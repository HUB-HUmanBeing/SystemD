import User from '/imports/classes/User';
import Project from '/imports/classes/Project';
import Sortable from 'sortablejs';

Template.editCategories.helpers({
    //add you helpers here
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    categories: function () {
        return Template.instance().categories
    },
    unchosenCategories: function () {
        return Template.instance().unchosenCategories
    },
    isEdited: function () {
        return Template.instance().isEdited.get()
    },
    categoriesLabel: function () {
        return Template.instance().isProject ? "types d'activités" : "centres d'interets"
    },
    categoriesLabelColor : function () {
        return Template.instance().isProject ? "orange" : "green"
    }

});

Template.editCategories.events({
    'click [editCategoriesBtn]': function (event, instance) {
        instance.isEditing.set(!instance.isEditing.get())
        resetTooltips()
        Meteor.setTimeout(() => {
            let unchosenCategories = document.getElementById("unchosenCategories")
            this.unchosen = Sortable.create(unchosenCategories, {
                group: {
                    name: "unchosenCategories",  // or { name: "...",
                    put: ['chosenCategories']
                },
                sort: false,
                onMove(){
                    instance.isEdited.set(true)
                },
                animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
            });

            let chosenCategories = document.getElementById("chosenCategories")
            this.chosen = Sortable.create(chosenCategories, {
                group: {
                    name: "chosenCategories",  // or { name: "...",
                    put: ['unchosenCategories']
                },
                onMove(){
                    instance.isEdited.set(true)
                },
                sort: true,  // sorting inside list
                animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
            });
        }, 300)
    },
    'click [saveCategoriesBtn]': function (event, instance) {
        let methodToCall = instance.isProject ? "updateInfoItem" : "updateProfileItem";
        let categories = []
        $("#chosenCategories li").each((i,el)=>{
            let id = el.getAttribute('id')
            let category = parseInt(id.split('-')[1])
            categories.push(category)
        })
        console.log(categories)
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
                    let message = instance.isProject ? "Les types d'activités du projet " : "Vos centres d'interets"
                    Materialize.toast(message + "ont été mise à jour", 6000, 'green')
                }
            })
    }
});

Template.editCategories.onCreated(function () {
    //add your statement here
    this.isProject = Template.currentData().owner === "project"
    this.id = this.isProject ? Template.currentData().projectId : Meteor.userId()
    this.owner = this.isProject ? Project.findOne({_id: this.id}) : User.findOne({_id: this.id})
    this.isEditing = new ReactiveVar(false)
    this.isEdited = new ReactiveVar(false)
    this.categories = this.isProject ? this.owner.publicInfo.categories : this.owner.profile.categories
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

