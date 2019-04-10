import projectController from "../../../../../../../lib/controllers/projectController";
import Comment from "/imports/classes/Comment";
import Publication from "../../../../../../../../imports/classes/Publication";

Template.commentList.helpers({
    //add you helpers here
    comments: function () {

        return Comment.find({publicationId: Template.currentData().publication._id, isRootComment: true}, {
            sort: {
                createdAt: -1
            }
        })
    },
    commentLeft: function () {
        let count = Template.currentData().publication.commentCount - Template.instance().limit.get()
        if (count > 0) {
            return count
        }
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    loadingMore: function () {
        return Template.instance().isLoading.get()
    }
});

Template.commentList.events({
    //add your events here
    'click [loadMoreComments]': function (event, instance) {
        event.preventDefault()
        instance.limit.set(instance.limit.get() + 15)
        instance.isLoading.set(true)
    }
});

Template.commentList.onCreated(function () {
    //add your statement here
    this.limit = new ReactiveVar(3)
    this.isLoading = new ReactiveVar(true)
    this.autorun(() => {
        let publication = Publication.findOne(this.data.publication._id)
        if (publication && publication.commentCount > 0) {
            Meteor.subscribe("rootComments", projectController.getAuthInfo(FlowRouter.current().params.projectId), this.data.publication._id, this.limit.get(), (err) => {
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

Template.commentList.onRendered(function () {
    //add your statement here
    this.data.refreshScrollbar()
});

Template.commentList.onDestroyed(function () {
    //add your statement here
});

