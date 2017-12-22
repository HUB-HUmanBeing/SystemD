import hubCrypto from "../../../../lib/hubCrypto";

Template.message.helpers({
    //add you helpers here
    message : function () {
        return Template.instance().decryptedMessage.get()
    }
});

Template.message.events({
    //add your events here
});

Template.message.onCreated(function () {
    this.decryptedMessage = new ReactiveVar('...')
    //add your statement here
    let encryptedMessage = this.data.encryptedMessage

    return hubCrypto.symDecryptData(encryptedMessage.content, this.data.convKey.convKey, this.data.convKey.vector, (messageContent) => {
        //on rentre le contenu déchiffré a la place du contenu chiffré
        encryptedMessage.content = messageContent

        //on va inserer dans notre objet le nom de l'auteur du message
        this.data.conversation.otherSpeakers.forEach((speaker) => {
            if (encryptedMessage.speakerId === speaker.speaker_id) {
                encryptedMessage.speakerName = speaker.name;

            }else{
               encryptedMessage.speakerName = Meteor.user().username
            }
            this.decryptedMessage.set(encryptedMessage)
        })

    })


});

Template.message.onRendered(function () {
    //add your statement here
    resetTooltips()
    Meteor.setTimeout(()=>{
        let selector= '#message-'+this.data.conversation.conversation_id+'-'+this.data.index
        Textarea.unformatBySelector(selector)
    }, 50)

});

Template.message.onDestroyed(function () {
    //add your statement here
});

