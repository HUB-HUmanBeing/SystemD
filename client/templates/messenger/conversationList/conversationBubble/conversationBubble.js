Template.conversationBubble.helpers({
    //add you helpers here
});

Template.conversationBubble.events({
    //add your events here
    'click [OpenConversation]' : function (event, instance) {
        Session.set("openedConversation" , instance.data.conversation)
    }
});

Template.conversationBubble.onCreated(function () {
    //add your statement here
});

Template.conversationBubble.onRendered(function () {
    //add your statement here
});

Template.conversationBubble.onDestroyed(function () {
    //add your statement here
});

