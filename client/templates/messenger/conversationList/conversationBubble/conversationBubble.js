Template.conversationBubble.helpers({
    //add you helpers here
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
    }
});

Template.conversationBubble.events({
    //lorsque l'utilisateur clique pour ouvrir une nouvelle conversation
    'click [OpenConversation]': function (event, instance) {
        // on vient récuperer les conversations ouverte , si yen a pas on donne un tableau vide
        let openedConversations = Session.get("openedConversations") ? Session.get("openedConversations") : []
        let addConv = true
        openedConversations.forEach((conv) => {
            //si elle est déja ouverte, on leve le drapeau disant il ne faut rien faire
            if (conv.conversation_id === instance.data.conversation.conversation_id) {
                addConv = false
            }
        })
        if (addConv) {
            //on passe la session a vide, pour pas qu'il y ai de conflits
            Session.set("openedConversations", [])
            //on met meme un petit setitimout car sinon ca duplique les conversations
            Meteor.setTimeout(() => {
                //pour chacunes d'entre elles


                //on commence par déterminer le nombre max de conversations a afficher a l'écran
                let maxNumber = 0

                let valeur_clientWidth = document.body.clientWidth
                if (Meteor.Device.isPhone()) {
                    maxNumber = 1
                } else if (valeur_clientWidth < 1284) {
                    maxNumber = 2
                } else {
                    maxNumber = 4
                }
                if (openedConversations.length < maxNumber) {
                    openedConversations.push(instance.data.conversation)
                } else {
                    if (maxNumber === 4) {
                        openedConversations[3] = openedConversations[2]
                        openedConversations[2] = openedConversations[1]
                        openedConversations[1] = openedConversations[0]
                    } else if (maxNumber === 2) {
                        openedConversations[1] = openedConversations[0]
                    }
                    openedConversations[0] = instance.data.conversation
                }
                Session.set("openedConversations", openedConversations)

            }, 50)

        }
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

