import cryptoTools from "../../../../../../../../lib/cryptoTools";
import projectController from "../../../../../../../../lib/controllers/projectController";
import Publication from "../../../../../../../../../imports/classes/Publication";
import Comment from "../../../../../../../../../imports/classes/Comment";

Template.commentItem.helpers({
    //add you helpers here
    decryptedContent: function () {
        return Template.instance().decryptedContent.get()
    },
    isDeletable: function () {
        return Template.currentData().comment.createdBy === projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
    },
    comments: function () {

        return Comment.find({commentId: Template.currentData().comment._id, isRootComment: false}, {
            sort: {
                createdAt: -1
            }
        })
    },
    showAnswer: function () {
        return Template.instance().showAnswer.get()
    },
    commentLeft: function () {
        let count = Template.currentData().comment.commentCount - Template.instance().limit.get()
        if (count > 0) {
            return count
        }
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    loadingMore: function () {
        return Template.instance().isLoading.get()
    },
    isEditing:function () {
        return Template.instance().isEditing.get()
    },
    abortEdition: function () {
        let instance = Template.instance()
        return function (newContent){
            instance.isEditing.set(false)
            instance.decryptedContent.set(newContent)
        }
    }
});

Template.commentItem.events({
    //add your events here
    'click [deleteComment]': function (event, instance) {
        event.preventDefault()
        instance.data.comment.callMethod("delete", projectController.getAuthInfo(FlowRouter.current().params.projectId), (err) => {
            if (err) {
                console.log(err)
            } else {
                Materialize.toast(__('commentItem.deleteSuccess'), 6000, 'toastOk')
            }
        })
    },
    'click [editComment]': function (event, instance) {
        event.preventDefault()
      instance.isEditing.set(true)
    },
    'click [answerComment]': function (event, instance) {
        event.preventDefault()
        instance.showAnswer.set(true)
        Meteor.setTimeout(() => {
            $("#newSubCommentText-" + instance.data.comment._id).focus()
        }, 200)

    },
    'click [loadMoreComments]': function (event, instance) {
        event.preventDefault()
        instance.limit.set(instance.limit.get() + 15)
        instance.isLoading.set(true)
    }
});

Template.commentItem.onCreated(function () {
    //add your statement here
    this.decryptedContent = new ReactiveVar("")
    cryptoTools.sim_decrypt_data(this.data.comment.symEnc_content, Session.get("currentProjectSimKey"), decryptedContent => {
        this.decryptedContent.set(decryptedContent)
    })
    this.showAnswer = new ReactiveVar(false)
    this.limit = new ReactiveVar(3)
    this.isLoading = new ReactiveVar(true)
    this.isEditing = new ReactiveVar(false)
    this.autorun(() => {
        let comment = Comment.findOne(this.data.comment._id)
        if (comment.commentCount > 0) {
            Meteor.subscribe("subComments", projectController.getAuthInfo(FlowRouter.current().params.projectId), this.data.comment._id, this.limit.get(), (err) => {
                this.isLoading.set(false)
                Meteor.setTimeout(() => {
                    this.data.refreshScrollbar()
                    this.isLoading.set(false)
                }, 1000)
            })
        } else {
            this.isLoading.set(false)
        }


    })
});

Template.commentItem.onRendered(function () {
    //add your statement here
    this.data.refreshScrollbar()

});

Template.commentItem.onDestroyed(function () {
    //add your statement here
});

