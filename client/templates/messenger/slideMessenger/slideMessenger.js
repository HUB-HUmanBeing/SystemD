Template.slideMessenger.helpers({
    //add you helpers here
    newMessagesCount : function () {
        let counter = 0
        Meteor.user().profile.conversations.forEach((conversation)=>{
                counter += conversation.unreadMessage
        })
        if(counter){
            let instance =Template.instance()
            instance.pulse.set(true)
            Meteor.setTimeout(()=>{
                instance.pulse.set(false)
            },3000)
        }
        return counter
    },
    pulse : function () {
        return Template.instance().pulse.get()
    },
    openedConversation : function () {
        let currentConv = Session.get('openedConversations')

        return currentConv? currentConv[0] : false;
    },
    phoneHeight : function () {
        return $(window).height() - 60;
    }
});

Template.slideMessenger.events({
    //add your events here
    'click [closeConversationPanel]' : function () {
        $('.button-collapse-slideMessenger').sideNav('hide');
    },
    'click [closeCurrentConversation]' : function () {
        Session.set("openedConversations", [])
    }
});

Template.slideMessenger.onCreated(function () {
    //add your statement here
    this.pulse = new ReactiveVar(false)
});

Template.slideMessenger.onRendered(function () {
    //add your statement here
    $('.button-collapse-slideMessenger').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'right', // Choose the horizontal origin
        closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });
});

Template.slideMessenger.onDestroyed(function () {
    //add your statement here
});

