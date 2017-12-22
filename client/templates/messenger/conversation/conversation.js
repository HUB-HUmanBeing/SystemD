import Conversation from "/imports/classes/Conversation";
import hubCrypto from '/client/lib/hubCrypto'
import User from "/imports/classes/User";
import MediumEditor from "medium-editor";
import MediumEditorOptionsChat from "/imports/MediumEditor/MediumEditorOptionsChat";

Template.conversation.helpers({
    //liste des messages de la conversation
    messages: function () {
        let conv = Conversation.findOne({_id: Template.instance().data.conversation.conversation_id})
        if(conv && conv.messages){
                return conv.messages.reverse()
        }else{
            return []
        }

    },
    //objet contenant la clef symétrique de la conversation ainsi que le vecteur d'initialisation
    convKey: function () {
        return Template.instance().convKey.get()
    },
});

Template.conversation.events({
    //au click sur fermeture de la conversation
    'click [closeConversation]': function (event, instance) {
        //on récupere les conversations en session
        let openedConversations = Session.get("openedConversations")
        //on met un petit setTimout en vidant la variable de session afin que meteor se mélange pas les pinceaux
        Session.set("openedConversations", [])
        Meteor.setTimeout(() => {
            //on retire celle qui a été cliquée
            openedConversations.forEach((conv, i) => {
                if (conv.conversation_id === instance.data.conversation.conversation_id) {
                    openedConversations.splice(i, 1)
                }
            })
            //et on remet en session l'objet modifié
            Session.set("openedConversations", openedConversations)
        }, 50)
    },
    'click [moreMessages]': function (event, instance) {
        instance.autoScrollingIsActive = false
        Meteor.setTimeout(()=>{
            instance.autoScrollingIsActive = true
        },1000)
        instance.limit.set(instance.limit.get() + 2)
    },
    'click [sendChat] , submit [chat]': function (event, instance) {
        let convId = instance.data.conversation.conversation_id
        let content = Textarea.formatBeforeSave($('#chat-content' + convId).html());
        let userConversation = instance.data.conversation;
        let otherSpeakers =  userConversation.otherSpeakers
        let conv = Conversation.findOne({_id : convId})
        hubCrypto.symEncryptData(content, instance.convKey.get().convKey, instance.convKey.get().vector, (encryptedContent) => {
            conv.callMethod('newMessage', encryptedContent, otherSpeakers, (err) => {
                if (err) {
                    console.log(err)
                    Materialize.toast("une erreur s'est produite", 4000, 'red');
                }
            })
        })
    }
});

Template.conversation.onCreated(function () {
    //on récupere les valeurs passées en argument lors de l'appel du template
    let userConversation = this.data.conversation;
    this.convId = userConversation.conversation_id
    this.autoScrollingIsActive = false;
    this.convKey = new ReactiveVar()
    this.scrollToBottom = (duration) => {
        Meteor.setTimeout(() => {
            let messageWindow = $('#chatMessages' + this.convId);
            let scrollHeight = messageWindow.prop("scrollHeight");
            messageWindow.stop().animate({scrollTop: scrollHeight}, duration || 0);
        }, 20)

    }
    hubCrypto.getUserConversationKey(this.convId, (convKey, vector) => {
            //pour chacuns des messages
            this.convKey.set( {
                convKey: convKey,
                vector: vector
            })
        }
    )
    //on initialise la limite de messages à appeler
    this.limit = new ReactiveVar(2);
    Tracker.autorun(() => {
        //on lance la subscription
        let messagesSubs = Meteor.subscribe('MessagesInfinite', userConversation.conversation_id, this.limit.get());
        //lorsqu'elle est prete
        if (messagesSubs.ready()) {
            let user = new User
            if (userConversation.unreadMessage > 0) {
                user.callMethod('conversationRead', this.convId)
            }
            Meteor.setTimeout(() => {
                this.scrollToBottom();
                this.autoScrollingIsActive = true;
            }, 50)
        }
    })
});

Template.conversation.onRendered(function () {
    //add your statement here
    Meteor.setTimeout(()=>{
        this.chatEditor = new MediumEditor('.chatEditor', MediumEditorOptionsChat)
    },100)

    if (this.autoScrollingIsActive) {
        this.scrollToBottom(250);
    }

});

Template.conversation.onDestroyed(function () {
    //add your statement here
    this.chatEditor.destroy()
});

