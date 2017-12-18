Template.conversation.helpers({
    //add you helpers here
});

Template.conversation.events({
    //add your events here
    'click [closeConversation]' : function (event, instance) {
        Session.set("openedConversation" , null)
    }
});

Template.conversation.onCreated(function () {
    //add your statement here
});

Template.conversation.onRendered(function () {
    //add your statement here
});

Template.conversation.onDestroyed(function () {
    //add your statement here
});

