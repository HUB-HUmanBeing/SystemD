import cryptoTools from "../../../../../../../../lib/cryptoTools";
import projectController from "../../../../../../../../lib/controllers/projectController";

Template.commentItem.helpers({
    //add you helpers here
    decryptedContent: function () {
        return Template.instance().decryptedContent.get()
    },
    isDeletable: function () {
        return Template.currentData().comment.createdBy === projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
    }
});

Template.commentItem.events({
    //add your events here
    'click [deleteComment]': function (event, instance) {
        event.preventDefault()
        instance.data.comment.callMethod("delete", projectController.getAuthInfo(FlowRouter.current().params.projectId), (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
});

Template.commentItem.onCreated(function () {
    //add your statement here
    this.decryptedContent = new ReactiveVar("")
    cryptoTools.sim_decrypt_data(this.data.comment.symEnc_content, Session.get("currentProjectSimKey"), decryptedContent => {
        this.decryptedContent.set(decryptedContent)
    })
});

Template.commentItem.onRendered(function () {
    //add your statement here
});

Template.commentItem.onDestroyed(function () {
    //add your statement here
});

