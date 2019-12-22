import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import Topic from "/imports/classes/Topic";

Template.topicHeader.helpers({
    //add you helpers here
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    isEditable: function () {
        let projectId = FlowRouter.current().params.projectId
        let isCreator = Template.currentData().currentTopic.createdBy === projectController.getCurrentUserProject(projectId).asymEnc_memberId
        let isAdmin= projectController.isAdmin(projectId)

        return  !Template.currentData().currentTopic.isMainTopic &&(isAdmin || isCreator)
    },
    isMemberNotified: function () {
        let membersToNotify = Template.currentData().currentTopic.membersToNotify
        let currentMemberId = projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
        return membersToNotify.indexOf(currentMemberId) >= 0
    },
});

Template.topicHeader.events({
    //add your events here
    'click [editName]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#editTopicName').focus()
            resetTooltips()
        }, 200)
        instance.isEditing.set(true)
    },
    'click [showDelete]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        instance.showDelete.set(true)
    },
    'submit [editTopicForm]': function (event, instance) {
        event.preventDefault()
        let topic = Topic.findOne(FlowRouter.current().queryParams.topicId)
        let topicName = event.target.editTopicName.value
        cryptoTools.sim_encrypt_data(topicName, Session.get("currentProjectSimKey"), (symEnc_name) => {
            topic.callMethod("editName", projectController.getAuthInfo(FlowRouter.current().params.projectId),  symEnc_name, (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
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
    'click [abortDelete]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        instance.showDelete.set(false)
    },
    'click [delete]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        let topic = Topic.findOne(FlowRouter.current().queryParams.topicId)
        let projectId = FlowRouter.current().params.projectId
        FlowRouter.go("/project/"+FlowRouter.current().params.projectId+"/forum")
        topic.callMethod("delete", projectController.getAuthInfo(projectId), (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                instance.showDelete.set(false)
                Materialize.toast(__('topicHeader.deleteSuccess'), 6000, 'toastOk')
            }
        })

    },
    'click [toggleNotifications]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        let topic =Topic.findOne(instance.data.currentTopic._id)
        let projectId = FlowRouter.current().params.projectId

        topic.callMethod("toggleNotify", projectController.getAuthInfo(projectId), (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                let membersToNotify = topic.membersToNotify
                let currentMemberId = projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
                let wasNotified = membersToNotify.indexOf(currentMemberId) >= 0
                let text = 'topicHeader.'+ (wasNotified ? "notifDisabled" : "notifEnabled")
                Materialize.toast(__(text), 6000, 'toastOk')

                Meteor.setTimeout(() => {
                    resetTooltips()
                }, 200)
            }
        })
    },
});

Template.topicHeader.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
});

Template.topicHeader.onRendered(function () {
    //add your statement here
});

Template.topicHeader.onDestroyed(function () {
    //add your statement here
});

