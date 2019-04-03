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
    }
});

Template.commentList.events({
    //add your events here
    'click [loadMoreComments]': function (event, instance) {
        event.preventDefault()
        instance.limit.set(instance.limit.get() + 15)
    }
});

Template.commentList.onCreated(function () {
    //add your statement here
    this.limit = new ReactiveVar(3)
    this.autorun(() => {
        let commentCount = Publication.findOne(this.data.publication._id).commentCount
        if (commentCount > 0) {
            Meteor.subscribe("rootComments", projectController.getAuthInfo(FlowRouter.current().params.projectId), this.data.publication._id, this.limit.get())
        }

        Meteor.setTimeout(() => {
            this.data.refreshScrollbar()
        }, 1000)
    })
});

Template.commentList.onRendered(function () {
    //add your statement here
});

Template.commentList.onDestroyed(function () {
    //add your statement here
});

