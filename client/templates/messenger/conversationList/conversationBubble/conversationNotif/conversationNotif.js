Template.conversationNotif.helpers({
    //add you helpers here
    newMessagesCount : function () {
        let counter = 0
        let conversation = Template.instance().data.conversation
            if(conversation.lastRead < conversation.lastOtherSpeakerMessage || !conversation.lastRead){
                counter ++
            }
        return counter
    },

});

Template.conversationNotif.events({
    //add your events here
});

Template.conversationNotif.onCreated(function () {
    //add your statement here
    this.pulse = new ReactiveVar(false)
});

Template.conversationNotif.onRendered(function () {
    //add your statement here
});

Template.conversationNotif.onDestroyed(function () {
    //add your statement here
});

