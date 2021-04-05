import conversationController from "../../lib/controllers/conversationController";
import projectController from "../../lib/controllers/projectController";
import Project from "../../../imports/classes/Project";

Template.messenger.helpers({
    //add you helpers here
    showConversation: function () {

        FlowRouter.watchPathChange()
        return !Template.instance().isLoading.get() && (Meteor.Device.isDesktop() || !!FlowRouter.current().queryParams.convId)
    },
    showMembers: function () {

        FlowRouter.watchPathChange()
        return !!FlowRouter.current().queryParams.members
    },

    showConversationList: function () {
        FlowRouter.watchPathChange()
        return Meteor.Device.isDesktop() || !FlowRouter.current().queryParams.convId
    },
    project: function () {
        FlowRouter.watchPathChange()
        if (FlowRouter.current().params.projectId) {
            return projectController.getCurrentUserProject(FlowRouter.current().params.projectId)
        }
    },
    conversations: function () {
        return Template.instance().conversationList.get()
    },

});

Template.messenger.events({
    //add your events here
    'click [newConversation]': function (event, instance) {

        conversationController.createNewConversation(instance.project, [], [], () => {
            console.log("ok")
        })
    }
});

Template.messenger.onCreated(function () {
    //add your statement here
    this.conversationList = new ReactiveVar([])

    this.limit = new ReactiveVar(15)
    this.project = null
    let projectId = FlowRouter.current().params.projectId
    if (projectId) {
        this.project = Project.findOne(projectId)
    }
    this.isLoading = new ReactiveVar(true)
    conversationController.initializeConversationList(this, () => {
        this.autorun(() => {
            FlowRouter.watchPathChange()
            let currentConvId = FlowRouter.current().queryParams.convId
this.isLoading.set(false)
            let currentConv
        })
    })
});

Template.messenger.onRendered(function () {
    //add your statement here
});

Template.messenger.onDestroyed(function () {
    //add your statement here
});

