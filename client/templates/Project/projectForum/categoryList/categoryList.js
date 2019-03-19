import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";

Template.categoryList.helpers({
    //add you helpers here
    showNewCategory: function () {
        Meteor.setTimeout(()=>{
            $('.collapsible').collapsible({})
        },200)
        return Template.instance().showNewCategory.get()
    },
    categories: function () {
        console.log(Template.currentData().categories)
        return Template.currentData().categories
    }
});

Template.categoryList.events({
    //add your events here
    'click [showNewCategory]': function (event, instance) {
        event.preventDefault()
        instance.showNewCategory.set(true)
        Meteor.setTimeout(() => {
            $('#newCategoryName').focus()
        }, 200)
    },
    "submit [newCategoryForm]": function (event, instance) {
        event.preventDefault()
        let currentProject = instance.data.currentProject
        let categoryName = $('#newCategoryName').val()
        let id= cryptoTools.generateId()
        cryptoTools.sim_encrypt_data(categoryName, Session.get("currentProjectSimKey"), (symEnc_categoryName) => {
            currentProject.callMethod("newForumCategory", projectController.getAuthInfo(currentProject._id), symEnc_categoryName,id ,(err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    instance.showNewCategory.set(false)
                    console.log("gagné", res)
                }
            })
        })


    }
});

Template.categoryList.onCreated(function () {
    //add your statement here
    this.showNewCategory = new ReactiveVar(false)

});

Template.categoryList.onRendered(function () {
    //add your statement here
});

Template.categoryList.onDestroyed(function () {
    //add your statement here
});

