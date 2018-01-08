import User from '/imports/classes/User'
import ShortenedEntity from "../../../../../imports/classes/ShortendEntity";
import hubCrypto from "../../../../lib/hubCrypto";
import Conversation from "../../../../../imports/classes/Conversation";
import Project from "../../../../../imports/classes/Project";

Template.projectMenuBtns.helpers({
    isFollowedAuthor : function () {
        return Meteor.user().profile.followedAuthors.includes(Template.currentData().projectId)
    },
    pulse: function () {
        return Template.instance().pulse.get()
    }
});

Template.projectMenuBtns.events({
    'click [follow]' : function (event, instance) {
        //on récupère l'utilisateur courant
        resetTooltips()
        let user = User.findOne({_id: Meteor.userId})
        //et on applique la méthode
        user.callMethod('followAuthor', instance.data.projectId, (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("Vous êtes désormais abonné aux articles de cet auteur", 2000, 'green')
                $('#interactionBtn').click()
            }
        })
    },
    'click [unFollow]' : function (event, instance) {
        resetTooltips()
        //on récupère l'utilisateur courant
        let user = User.findOne({_id: Meteor.userId})
        //et on applique la méthode
        user.callMethod('unFollowAuthor', instance.data.projectId, (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("Vous n'êtes plus abonné aux articles de cet auteur", 2000, 'orange')
                $('#interactionBtn').click()
            }
        })
    },
    'click [newConversation]': function (event, instance) {
        resetTooltips()
        //on récupère l'utilisateur courant
        let currentUser = Meteor.user()
        //on recupere l'autre
        let otherSpeaker = Project.findOne({_id: instance.data.projectId})

        hubCrypto.generateNewConversationBrunchOfKeys(
            currentUser.profile.asymPublicKey,
            otherSpeaker.publicInfo.asymPublicKey,
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
                shortenedOtherSpeakerEntity.isProject = true
                shortenedOtherSpeakerEntity.imgUrl = otherSpeaker.publicInfo.imgUrl
                shortenedOtherSpeakerEntity.speaker_id = otherSpeaker._id
                //et on applique la méthode
                conversation.callMethod('newConversation', shortenedCreatorEntity, shortenedOtherSpeakerEntity, brunchOfKeys, (error,result) => {
                    //si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        Materialize.toast("une erreur s'est produite", 4000, 'red')
                    } else {//si tout s'est bien passé
                        //on simule un click sur le bouton d'interaction pour le refermer
                        $('#interactionBtn').click()
                        //on simule un click sur le bouton d'affichage de la liste de conversations
                        $('#showConversationsButton').click()
                        hubCrypto.decryptAndStoreInSesstionBrunchOfUserConversationKeys(() => {
                        })
                        Meteor.setTimeout(()=>{
                            //apres un certain laps de temps, on ouvre la conversation
                            $('#conversationBubble-'+result).click()
                        },500)
                    }
                })
            }
        )
    }
});

Template.projectMenuBtns.onCreated(function () {
    //add your statement here
    this.pulse = new ReactiveVar(true)
    Meteor.setTimeout(() => {
        this.pulse.set(false)
    }, 5000)
});

Template.projectMenuBtns.onRendered(function () {
    //add your statement here
});

Template.projectMenuBtns.onDestroyed(function () {
    //add your statement here
});

