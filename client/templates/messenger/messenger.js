import conversationController from "../../lib/controllers/conversationController";
import projectController from "../../lib/controllers/projectController";
import Project from "../../../imports/classes/Project";

Template.messenger.helpers({
    //add you helpers here
    showConversation: function () {

        FlowRouter.watchPathChange()
        return Meteor.Device.isDesktop() || !!FlowRouter.current().queryParams.conversationId
    },

    showConversationList: function () {
        FlowRouter.watchPathChange()
        return Meteor.Device.isDesktop() || !FlowRouter.current().queryParams.conversationId
    },
    project:function (){
        FlowRouter.watchPathChange()
        if(FlowRouter.current().params.projectId){
            return projectController.getCurrentUserProject(FlowRouter.current().params.projectId)
        }
    }
});

Template.messenger.events({
    //add your events here
    'click [newConversation]': function (event, instance){

        conversationController.createNewConversation(instance.project, [], [], ()=>{
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
    if(projectId){
        this.project =  Project.findOne(projectId)
    }
    conversationController.initializeConversationList(this)
});

Template.messenger.onRendered(function () {
    //add your statement here
});

Template.messenger.onDestroyed(function () {
    //add your statement here
});

