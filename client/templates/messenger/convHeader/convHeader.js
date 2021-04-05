import conversationController from "../../../lib/controllers/conversationController";
import cryptoTools from "../../../lib/cryptoTools";
import projectController from "../../../lib/controllers/projectController";
import Topic from "../../../../imports/classes/Topic";
import Conversation from "../../../../imports/classes/Conversation";

Template.convHeader.helpers({
    //add you helpers here
    currentConv: function () {
       return Template.instance().decryptedConv.get()
    },
    convName: function () {
        return conversationController.getConvName(Template.instance().decryptedConv.get(), Template.instance().otherMembers.get())

    },
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    isEditable: function () {
        return true
    },
});

Template.convHeader.events({
    //add your events here
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
        let conv = Conversation.findOne(FlowRouter.current().queryParams.convId)
        let topicName = event.target.editTopicName.value
        cryptoTools.sim_encrypt_data(topicName, conversationController.getSimKey(FlowRouter.current().queryParams.convId), (symEnc_name) => {
            conv.callMethod("editName", conversationController.getAuthInfo( FlowRouter.current().queryParams.convId,instance),  symEnc_name, (err, res) => {
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
    }
});

Template.convHeader.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
    this.decryptedConv = new ReactiveVar({})
    this.decryptedMembers = new ReactiveVar([])
    this.otherMembers = new ReactiveVar([])
    this.autorun(() => {
        FlowRouter.watchPathChange()
        if (FlowRouter.current().queryParams.convId) {
            cryptoTools.decryptObject(conversationController.getConv(FlowRouter.current().queryParams.convId), {symKey: conversationController.getSimKey(FlowRouter.current().queryParams.convId)}, (decryptedConv) => {
                this.decryptedConv.set(decryptedConv)

            })
            cryptoTools.decryptArrayOfObject(conversationController.getConv(FlowRouter.current().queryParams.convId).members, {symKey: conversationController.getSimKey(FlowRouter.current().queryParams.convId)}, (decryptedMembers) => {
                this.decryptedMembers.set(decryptedMembers)
                let otherMembers = []
                decryptedMembers.forEach(convMember => {
                    if (convMember.asymEnc_memberId == conversationController.currentUserMemberForConv(FlowRouter.current().queryParams.convId)) {
                        otherMembers.push(convMember)
                    }
                })
                this.otherMembers.set(otherMembers)
            })

        }

    })


});

Template.convHeader.onRendered(function () {
    //add your statement here
});

Template.convHeader.onDestroyed(function () {
    //add your statement here
});

