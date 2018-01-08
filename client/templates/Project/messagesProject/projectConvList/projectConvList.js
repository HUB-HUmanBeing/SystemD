import hubCrypto from "../../../../lib/hubCrypto";

Template.projectConvList.helpers({
    conversations : function () {
        //on récupere les conversation de l'utilisateur
        let conversations = Template.instance().data.project.conversations
        //et on les trie afin que celles avec des nouveaux messages arrivent en haut
        conversations.sort((a,b)=>{
            return b.unreadMessage - a.unreadMessage;
        })
        console.log(Template.instance().data.project.conversations)
        console.log(conversations)
        return conversations

    },
});

Template.projectConvList.events({
    //add your events here
});

Template.projectConvList.onCreated(function () {
    //add your statement here
    //add your statement here
    let otherSpeakers = []
    Meteor.user().profile.conversations.forEach((conv)=>{
        conv.otherSpeakers.forEach((user)=>{
            otherSpeakers.push(user.speaker_id)
        })
    })
    Meteor.subscribe('userPresence', otherSpeakers)

});

Template.projectConvList.onRendered(function () {
    //add your statement here
    hubCrypto.decryptAndStoreInSesstionBrunchOfProjectConversationKeys(this.data.project,() => {
    })
    resetTooltips()
});

Template.projectConvList.onDestroyed(function () {
    //add your statement here
});

