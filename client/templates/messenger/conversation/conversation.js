import Conversation from "/imports/classes/Conversation";
import hubCrypto from '/client/lib/hubCrypto'
import User from "../../../../imports/classes/User";
import MediumEditor from "medium-editor";
import MediumEditorOptionsComment from "../../../../imports/MediumEditor/MediumEditorOptionsComment";

Template.conversation.helpers({
    //liste des messages de la conversation
    messages: function () {
        return Template.instance().messages.get()
    }
});

Template.conversation.events({
    //au click sur fermeture de la conversation
    'click [closeConversation]': function (event, instance) {
        //on récupere les conversations en session
        let openedConversations = Session.get("openedConversations")
        //on met un petit setTimout en vidant la variable de session afin que meteor se mélange pas les pinceaux
        Session.set("openedConversations", [])
        Meteor.setTimeout(()=>{
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
    'click [moreMessages]' : function (event, instance) {
        instance.limit.set(instance.limit.get()+15)
    },
    'click [sendChat] , submit [chat]' : function (event, instance) {
        let convId = instance.data.conversation.conversation_id
        let content = Textarea.formatBeforeSave($('#chat-content'+convId).html());
        console.log(content)
    }
});

Template.conversation.onCreated(function () {

        //on initialise la limite de messages à appeler
        this.limit = new ReactiveVar(5);
//on récupere les valeurs passées en argument lors de l'appel du template
        let userConversation = this.data.conversation;
        //on initialise le nombre de messages collectés par la souscription
        this.messages = new ReactiveVar([])
    Meteor.setTimeout(()=> {
        Tracker.autorun(() => {
            //on lance la subscription
            let messagesSubs = Meteor.subscribe('MessagesInfinite', userConversation.conversation_id, this.limit.get());
            //lorsqu'elle est prete
            if (messagesSubs.ready()) {
                let convId = userConversation.conversation_id
                //on récupere la conversation
                let conversation = Conversation.findOne({_id: convId})

                let messages = []
                let encryptedMessages = conversation.messages
                //on commence par récuperer les clef
                return hubCrypto.getUserConversationKey(convId, (convKey, vector) => {
                    //pour chacuns des messages
                    return encryptedMessages.forEach((encryptedMessage, i) => {
                        //on dechiffre les messages
                        return hubCrypto.symDecryptData(encryptedMessage.content, convKey, vector, (messageContent) => {
                            //on rentre le contenu déchiffré a la place du contenu chiffré
                            encryptedMessage.content = messageContent
                            //on va inserer dans notre objet le nom de l'auteur du message
                            userConversation.otherSpeakers.forEach((speaker) => {
                                if (encryptedMessage.speakerId === speaker.speaker_id) {
                                    encryptedMessage.speakerName = speaker.name;
                                }
                            })
                            //on les push par le haut du tableau afin que les messages soient affichés de bas en haut (derniers en bas)
                            messages.unshift(encryptedMessage)
                            //lorsqu'on parcours le dernier element du tableau, on le met dans la reactive var
                            if (i === encryptedMessages.length - 1) {
                                this.messages.set(messages)
                                resetTooltips()
                                let user = new User
                                if (userConversation.unreadMessage > 0) {
                                    user.callMethod('conversationRead', convId)
                                }
                                Meteor.setTimeout(()=>{
                                    let height = 0;
                                    $('#chatMessages'+convId+'>div').each(function(i, value){
                                        height += parseInt($(this).height());
                                    });
                                    height += '';
                                    $('#chatMessages'+convId).animate({scrollTop: height});
                                }, 70)
                            }
                        })
                    })
                })
            }
        })

    }, 50)
});

Template.conversation.onRendered(function () {
    //add your statement here
    this.chatEditor = new MediumEditor('.chatEditor', MediumEditorOptionsComment)


});

Template.conversation.onDestroyed(function () {
    //add your statement here
    this.chatEditor.destroy()
});

