import conversationController from "../../lib/controllers/conversationController";

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
});

Template.messenger.events({
    //add your events here
    'click [newConversation]': function (event, instance){
        conversationController.createNewConversation(null, [], [], ()=>{
            console.log("ok")
        })
    }
});

Template.messenger.onCreated(function () {
    //add your statement here
});

Template.messenger.onRendered(function () {
    //add your statement here
});

Template.messenger.onDestroyed(function () {
    //add your statement here
});

