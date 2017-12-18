Template.conversationList.helpers({
    //add you helpers here
    conversations : function () {
        let conversations = Meteor.user().profile.conversations
        let sortedConversations = []

        conversations.sort((a,b)=>{
            if(a.lastOtherSpeakerMessage && b.lastOtherSpeakerMessage ){
                return a.lastOtherSpeakerMessage - b.lastOtherSpeakerMessage;
            }
        })
        conversations.forEach((conversation)=>{
            if(conversation.lastRead < conversation.lastOtherSpeakerMessage || !conversation.lastRead){
                sortedConversations.unshift(conversation)

            }else{
                sortedConversations.push(conversation)
            }
        })
        return sortedConversations
    },
    height : function () {
        let valeur_clientWidth = document.body.clientWidth
        if(valeur_clientWidth >1284 || valeur_clientWidth >601){
            return "100vh"
        }else {
            return toString(document.body.clientHeight -75) + "px"
        }
    }
});

Template.conversationList.events({
    //add your events here
    'click [closeConversations]' : function (event, instance) {

        $('.hideConversations').click() //un peu sale pour eviter d'avoir a remonter l'arborescence des templates
        resetTooltips()
    }
});

Template.conversationList.onCreated(function () {
    //add your statement here
});

Template.conversationList.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.conversationList.onDestroyed(function () {
    //add your statement here
});

