import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";

Template.categoryItem.helpers({
    //add you helpers here
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    canMoveUp: function () {
        return Template.currentData().index > 0
    },
    canMoveDown: function () {
        return Template.currentData().index < Template.currentData().currentProject.private.forumCategories.length - 1
    },
    isMemberNotified: function () {
        let membersToNotify = Template.currentData().category.membersToNotify
        let currentMemberId = projectController.getCurrentUserProject(Template.currentData().currentProject._id).asymEnc_memberId
        return membersToNotify.indexOf(currentMemberId) >= 0
    }
});

Template.categoryItem.events({
    //add your events here
    'click [openSettings]': function (event) {
        event.stopPropagation()
    },
    'click [editName]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#editCategoryName').focus()
            resetTooltips()
        }, 200)
        instance.isEditing.set(true)
    },
    'click [showDelete]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#editCategoryName').focus()
            resetTooltips()
        }, 200)
        instance.showDelete.set(true)
    },
    'submit [editCategoryForm]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        let currentProject = instance.data.currentProject
        let categoryName = event.target.editCategoryName.value
        cryptoTools.sim_encrypt_data(categoryName, Session.get("currentProjectSimKey"), (symEnc_categoryName) => {
            currentProject.callMethod("editForumCategoryName", projectController.getAuthInfo(currentProject._id), instance.data.index, symEnc_categoryName, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    instance.isEditing.set(false)
                    Meteor.setTimeout(() => {
                        resetTooltips()
                    }, 200)
                }
            })
        })
    },
    'click [moveUp]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        console.log("coucou")
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        currentProject.callMethod("moveForumCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, "up", (err, res) => {
            if (err) {
                console.log(err)
            } else {
                instance.isEditing.set(false)
                Meteor.setTimeout(() => {
                    resetTooltips()
                }, 200)
            }
        })

    },
    'click [moveDown]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        console.log("coucou")
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        currentProject.callMethod("moveForumCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, "down", (err, res) => {
            if (err) {
                console.log(err)
            } else {
                instance.isEditing.set(false)
                Meteor.setTimeout(() => {
                    resetTooltips()
                }, 200)
            }
        })

    },
    'click [delete]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        currentProject.callMethod("deleteForumCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                instance.showDelete.set(false)
                Meteor.setTimeout(() => {
                    resetTooltips()
                    if (instance.data.currentProject.private.forumCategories.length === 0) {
                        window.location.reload()
                    }
                }, 200)
            }
        })

    },
    'click [toggleNotifications]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        console.log(instance.data)
        currentProject.callMethod("toggleNotifyCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                Meteor.setTimeout(() => {
                    resetTooltips()
                }, 200)
            }
        })
    }
});

Template.categoryItem.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
});

Template.categoryItem.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.categoryItem.onDestroyed(function () {
    //add your statement here
});

