import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Topic from "../../../../../imports/classes/Topic";

Template.categoryList.helpers({
    //add you helpers here
    showNewCategory: function () {
        Meteor.setTimeout(() => {
            $('.collapsible').collapsible({})
        }, 200)
        return Template.instance().showNewCategory.get()
    },
    categories: function () {
        return Template.currentData().categories
    },
    mainTopic: function () {
        return Topic.findOne({
            "$and": [{
                projectId: FlowRouter.current().params.projectId
            }, {
                isMainTopic: true
            }]
        })
    },
    isCreating: function () {
        return Template.instance().isCreating.get()
    }
});

Template.categoryList.events({
    //add your events here
    'click [showNewCategory]': function (event, instance) {
        event.preventDefault()
        instance.showNewCategory.set(true)
        resetTooltips()
        Meteor.setTimeout(() => {
            $('#newCategoryName').focus()
        }, 200)
    },
    'click [hideNewCategory]': function (event, instance) {
        event.preventDefault()
        instance.showNewCategory.set(false)
       resetTooltips()
    },
    "submit [newCategoryForm]": function (event, instance) {
        event.preventDefault()
        instance.isCreating.set(true)
        let currentProject = instance.data.currentProject
        let categoryName = $('#newCategoryName').val()
        let id = cryptoTools.generateId()
        let membersToNotify = []
        Session.get("currentProjectMembers").forEach(member => {
            if (member.role === "admin" || member.symEnc_userId === Meteor.userId()) {
                membersToNotify.push(member.memberId)
            }
        })
        cryptoTools.sim_encrypt_data(categoryName, Session.get("currentProjectSimKey"), (symEnc_categoryName) => {
            currentProject.callMethod("newForumCategory", projectController.getAuthInfo(currentProject._id), symEnc_categoryName, id, membersToNotify, (err, res) => {
                if (err) {
                    console.log(err)
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                } else {
                    instance.showNewCategory.set(false)
                    instance.isCreating.set(false)
                }
            })
        })


    }
});

Template.categoryList.onCreated(function () {
    //add your statement here
    this.showNewCategory = new ReactiveVar(false)
    this.isCreating = new ReactiveVar(false)
    let projectId = FlowRouter.current().params.projectId
    Meteor.subscribe('mainTopic', projectController.getAuthInfo(projectId), projectId)
});

Template.categoryList.onRendered(function () {
    //add your statement here
});

Template.categoryList.onDestroyed(function () {
    //add your statement here
});

