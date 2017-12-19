import Conversation from "/imports/classes/Conversation";
import hubCrypto from '/client/lib/hubCrypto'

Template.conversation.helpers({
    //add you helpers here
    messages: function () {
        return Template.instance().messages.get()
    }
});

Template.conversation.events({
    //add your events here
    'click [closeConversation]': function (event, instance) {
        let openedConversations = Session.get("openedConversations")
        openedConversations.forEach((conv, i) => {
            if (conv.conversation_id === instance.data.conversation.conversation_id) {
                openedConversations.splice(i, 1)
            }
        })
        Session.set("openedConversations", openedConversations)
    }
});

Template.conversation.onCreated(function () {
    //on initialise la limite de messages à appeler
    this.limit = new ReactiveVar(15);
//on récupere les valeurs passées en argument lors de l'appel du template
    let userConversation = Template.currentData().conversation;
    //on initialise le nombre de messages collectés par la souscription
    this.messages = new ReactiveVar([])
    Tracker.autorun(() => {
        //on lance la subscription
        let messagesSubs = Meteor.subscribe('MessagesInfinite', userConversation.conversation_id, this.limit.get());
        if (messagesSubs.ready()) {
            let convId = userConversation.conversation_id
            let conversation = Conversation.findOne({_id: convId})
            let messages = []
            let encryptedMessages = conversation.messages
            return hubCrypto.getUserConversationKey(convId, (convKey, vector) => {
                return encryptedMessages.forEach((encryptedMessage, i) => {
                    return hubCrypto.symDecryptData(encryptedMessage.content, convKey, vector, (messageContent) => {
                        encryptedMessage.content = messageContent
                        userConversation.otherSpeakers.forEach((speaker)=>{
                            if(encryptedMessage.speakerId === speaker.speaker_id){
                                encryptedMessage.speakerName =speaker.name ;
                            }
                        })

                        messages.unshift(encryptedMessage)
                        if (i === encryptedMessages.length - 1) {
                            this.messages.set(messages)
                            resetTooltips()

                        }
                    })
                })
            })
        }

    })


});

Template.conversation.onRendered(function () {
    //add your statement here
});

Template.conversation.onDestroyed(function () {
    //add your statement here
});

