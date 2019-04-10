import projectController from "../../../../../../../../../lib/controllers/projectController";
import cryptoTools from "../../../../../../../../../lib/cryptoTools";

Template.subComment.helpers({
    //add you helpers here
    decryptedContent: function () {
        return Template.instance().decryptedContent.get()
    },
    isDeletable: function () {
        return Template.currentData().comment.createdBy === projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
    },
});

Template.subComment.events({
    //add your events here
    'click [deleteComment]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        instance.data.comment.callMethod("delete", projectController.getAuthInfo(FlowRouter.current().params.projectId), (err) => {
            if (err) {
                console.log(err)
            } else {
                Materialize.toast(__('commentItem.deleteSuccess'), 6000, 'toastOk')
            }
        })
    },
});

Template.subComment.onCreated(function () {
    //add your statement here
    this.decryptedContent = new ReactiveVar("")
    cryptoTools.sim_decrypt_data(this.data.comment.symEnc_content, Session.get("currentProjectSimKey"), decryptedContent => {
        this.decryptedContent.set(decryptedContent)
    })
});

Template.subComment.onRendered(function () {
    //add your statement here
});

Template.subComment.onDestroyed(function () {
    //add your statement here
});

