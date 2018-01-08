import Conversation from "/imports/classes/Conversation";
import hubCrypto from '/client/lib/hubCrypto'
import User from "/imports/classes/User";
import MediumEditor from "medium-editor";
import MediumEditorOptionsChat from "/imports/MediumEditor/MediumEditorOptionsChat";
import ConversationMessages from "/lib/collections/ConversationMessages";

Template.conversation.helpers({
    //liste des messages de la conversation
    messages: function () {
        //on les récupere
        let messages = ConversationMessages.find(
            {conversation_id: Template.instance().data.conversation.conversation_id},
            {
                sort: {
                    sendAt: -1
                }
            }).fetch()
        //s'il y en a
        if (messages.length) {
            //si il y en a moins que la limite
            if (messages.length
                < Template.instance().limit.get()) {
                //on indique qu'il n'y aura pas plus de message a récolter
                Template.instance().noMoreMessageToFind.set(true)
            } else {
                Template.instance().noMoreMessageToFind.set(false)
            }
            return messages.reverse()
        } else {

            return []
        }

    },
    //objet contenant la clef symétrique de la conversation ainsi que le vecteur d'initialisation
    convKey: function () {
        return Template.instance().convKey.get()
    },
    //true si il n'y a pas plus de messages a récolter
    noMoreMessageToFind: function () {
        return Template.instance().noMoreMessageToFind.get()
    },
    phoneHeight : function () {
        return $(window).height() - 240;
    },
    isPresent : function () {
        let otherSpeakers = []
        Template.instance().data.conversation.otherSpeakers.forEach((user)=>{
            otherSpeakers.push(user.speaker_id)
        })
        return presences.find({
            userId: {
                $in: otherSpeakers
            }
        }).count()
    },
    showPresence : function () {
        let showPresence = false
        Template.instance().data.conversation.otherSpeakers.forEach((speaker)=>{
            if(!speaker.isProject){
                showPresence = true
            }
        })
        return showPresence
    }
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
    //lorsqu'on clique sur plus de messages
    'click [moreMessages]': function (event, instance) {
        event.preventDefault()
        //on change momentanément la valeur de certaines réactives var pour empecher le comportement automatique de scroll vers le bas
        instance.autoScrollingIsActive = false
        instance.isRequestingForHistory = true
        Meteor.setTimeout(() => {
            instance.isRequestingForHistory = false
            instance.autoScrollingIsActive = true
        }, 1000)
        //fonction permettant de re-scroller vers le dernier message lu
        Tracker.afterFlush(() => {
            Meteor.setTimeout(() => {
                let height = $("#chat-" + instance.convId + "-message-" + (instance.step + 1)).offset().top - ($("#conv-" + instance.convId).offset().top + 250)
                $('#chatMessages' + instance.convId).animate({
                    scrollTop: height
                }, 0);
            }, 250)
        })
        //on augmente la limite du nombre de messages a aleer collecter
        instance.limit.set(instance.limit.get() + instance.step)
    },
    //lorsqu'on clique sur envoyer
    'click [sendChat] , submit [chat]': function (event, instance) {
        event.preventDefault()
        //on viens récuperer toutes les info nécessaires
        let convId = instance.data.conversation.conversation_id
        let content = Textarea.formatBeforeSave($('#chat-content' + convId).html());//on formatte le texte
        if (content){
            let userConversation = instance.data.conversation;
            let otherSpeakers = userConversation.otherSpeakers
            //on crée une nouvelle conversation juste pour appeler sa méthode
            let conv = new Conversation()
            //on vien chiffrer le message
            hubCrypto.symEncryptData(content, instance.convKey.get().convKey, instance.convKey.get().vector, (encryptedContent) => {
                //puis on appelle la méthode
                conv.callMethod('newMessage', convId, encryptedContent, otherSpeakers, (err) => {
                    if (err) {
                        console.log(err)
                        Materialize.toast("une erreur s'est produite", 4000, 'red');
                    } else {
                        //si ya pas d'erreur
                        $('#chat-content' + convId).html("")//on remet a zéro la zone d'édition
                        //et on relance une souscription pour récuperer le dernier message
                        let messagesSubs = Meteor.subscribe('MessagesInfinite', instance.data.conversation.conversation_id, instance.limit.get());
                        //lorsqu'elle est prete, on scroll au bas de page
                        Tracker.autorun(()=>{
                            if (messagesSubs.ready()) {
                                Meteor.setTimeout(() => {
                                    instance.scrollToBottom(250);
                                }, 200)
                            }
                        })

                    }
                })
            })
        }

    }
});

Template.conversation.onCreated(function () {
    //on récupere les valeurs passées en argument lors de l'appel du template
    this.noMoreMessageToFind = new ReactiveVar(false)
    let userConversation = this.data.conversation;
    this.convId = userConversation.conversation_id
    this.autoScrollingIsActive = false;
    this.isRequestingForHistory = false
    this.convKey = new ReactiveVar()
    //fonction permettant de scroller au bas de la discussion
    this.scrollToBottom = (duration) => {
        Meteor.setTimeout(() => {
            let messageWindow = $('#chatMessages' + this.convId);
            let scrollHeight = messageWindow.prop("scrollHeight");
            messageWindow.stop().animate({scrollTop: scrollHeight}, duration || 0);
        }, 20)

    }
    //on récupere la cléf symétrique de la conversation
    hubCrypto.getUserConversationKey(this.convId, (convKey, vector) => {
            //pour chacuns des messages
            this.convKey.set({
                convKey: convKey,
                vector: vector
            })
        }
    )
    //on initialise la limite de messages à appeler et par paquet de combien on va les appeler par la suite
    this.step = 10
    this.limit = new ReactiveVar(this.step);
    Tracker.autorun(() => {
        //on lance la subscription
        let messagesSubs = Meteor.subscribe('MessagesInfinite', userConversation.conversation_id, this.limit.get());
        //lorsqu'elle est prete
        if (messagesSubs.ready() && !this.isRequestingForHistory) {
            let user = new User
            //si il y avais des messages non-lus, on appelle la méthode permettant de dire que la conversation à bien été vue

            Meteor.setTimeout(() => {
                if (userConversation.unreadMessage > 0) {
                    user.callMethod('conversationRead', this.convId)
                }
            },200)

            Meteor.setTimeout(() => {

                this.scrollToBottom(250);
            }, 50)
        }
    })
});

Template.conversation.onRendered(function () {
    //add your statement here
        this.chatEditor = new MediumEditor('.chatEditor', MediumEditorOptionsChat)

    if (this.autoScrollingIsActive) {
        this.scrollToBottom(250);
    }
});

Template.conversation.onDestroyed(function () {
    //add your statement here
    this.chatEditor.destroy()
});

