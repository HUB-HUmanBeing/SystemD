Template.messengerContainer.helpers({
    //compteur des nouveaux messages
    newMessagesCount : function () {
        let counter = 0
        Meteor.user().profile.conversations.forEach((conversation)=>{
            counter += conversation.unreadMessage
        })
        if(counter){
            let pulse = Template.instance().pulse
            pulse.set(true)
            Meteor.setTimeout(()=>{
                pulse.set(false)
            },3000)
        }

        return counter
    },
    pulse : function () {
        return Template.instance().pulse.get()
    },
    showConversations : function () {
        return !Template.instance().hideConversations.get()
    },
    openedConversations : function () {
        return Session.get('openedConversations')
    }
});

Template.messengerContainer.events({
    //add your events here
    'click [showConversations]' : function (event, instance) {
        instance.hideConversations.set(false)
        Session.set('openConversationPannel', true)
    },
    'click .hideConversations' : function (event, instance) {
        instance.hideConversations.set(true)
        Session.set('openConversationPannel', false)
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

