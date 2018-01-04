import hubCrypto from "../../../../../lib/hubCrypto";
import ShortenedEntity from "../../../../../../imports/classes/ShortendEntity";
import Conversation from "../../../../../../imports/classes/Conversation";
import User from "../../../../../../imports/classes/User";

Template.potentialSpeaker.helpers({
    //add you helpers here
});

Template.potentialSpeaker.events({
    //add your events here
    'click [newConversation]' : function (event, instance) {
        event.preventDefault()
        resetTooltips()
        //on récupère l'utilisateur courant
        let currentUser = Meteor.user()
        //on recupere l'autre
        let otherSpeaker = instance.data.item

        hubCrypto.generateNewConversationBrunchOfKeys(
            currentUser.profile.asymPublicKey,
            otherSpeaker.asymPublicKey,
            false,
            (brunchOfKeys) => {
                //on crée une nouvelle conversation
                let conversation = new Conversation()
                //on cree la shortenedEntity du createur de la conversation et on la remplit avec les bonnes infos
                let shortenedCreatorEntity = new ShortenedEntity()
                shortenedCreatorEntity.name = currentUser.username
                shortenedCreatorEntity.isProject = false
                shortenedCreatorEntity.imgUrl = currentUser.profile.imgUrl
                shortenedCreatorEntity.speaker_id = currentUser._id
                //on cree la shortenedEntity de l'autre membre de la conversation et on la remplit avec les bonnes infos
                let shortenedOtherSpeakerEntity = new ShortenedEntity()
                shortenedOtherSpeakerEntity.name = otherSpeaker.name
                shortenedOtherSpeakerEntity.isProject = instance.data.type === "project"
                shortenedOtherSpeakerEntity.imgUrl = otherSpeaker.imgUrl
                shortenedOtherSpeakerEntity.speaker_id = otherSpeaker._id
                //et on applique la méthode
                conversation.callMethod('newConversation', shortenedCreatorEntity, shortenedOtherSpeakerEntity, brunchOfKeys, (error,result) => {
                    //si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        Materialize.toast("une erreur s'est produite", 4000, 'red')
                    } else {//si tout s'est bien passé
                        //on simule un click sur le bouton d'affichage de la liste de conversations
                        $('#showConversationsButton').click()
                        $('#new-conversation-modal').modal('close')
                        Meteor.setTimeout(()=>{
                            //apres un certain laps de temps, on
                            $('#conversationBubble-'+result).click()
                        },500)
                    }
                })
            }
        )
    }
});

Template.potentialSpeaker.onCreated(function () {
    //add your statement here
});

Template.potentialSpeaker.onRendered(function () {
    //add your statement here
});

Template.potentialSpeaker.onDestroyed(function () {
    //add your statement here
});

