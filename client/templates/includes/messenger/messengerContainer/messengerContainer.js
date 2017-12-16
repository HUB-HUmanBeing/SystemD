Template.messengerContainer.helpers({
    //add you helpers here
    newMessagesCount : function () {
        let counter = 0
        Meteor.user().profile.conversations.forEach((conversation)=>{
            if(conversation.lastRead < conversation.lastOtherSpeakerMessage){
                counter ++
                Template.instance().pulse.set(true)
                Meteor.setTimeout(()=>{
                    Template.instance().pulse.set(false)
                },3000)
            }
        })

        return counter
    },
    pulse : function () {
        return Template.instance().pulse.get()
    },
    showConversations : function () {
        return !Template.instance().hideConversations.get()
    }
});

Template.messengerContainer.events({
    //add your events here
    'click [toggleConversations]' : function (event, instance) {
        instance.hideConversations.set(!instance.hideConversations.get())
    }
});

Template.messengerContainer.onCreated(function () {
    //add your statement here
    this.pulse = new ReactiveVar(false)
    this.hideConversations = new ReactiveVar(true)
});

Template.messengerContainer.onRendered(function () {
    //add your statement here
});

Template.messengerContainer.onDestroyed(function () {
    //add your statement here
});

