Template.conversationList.helpers({
    //add you helpers here
    conversations : function () {
        //on récupere les conversation de l'utilisateur
        let conversations = Meteor.user().profile.conversations
        //et on les trie afin que celles avec des nouveaux messages arrivent en haut
        conversations.sort((a,b)=>{
                return b.unreadMessage - a.unreadMessage;
        })
        return conversations
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

