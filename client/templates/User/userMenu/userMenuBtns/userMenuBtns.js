import User from '/imports/classes/User'
import hubCrypto from '/client/lib/hubCrypto'
import Conversation from '/imports/classes/Conversation'
import ShortenedEntity from '/imports/classes/ShortendEntity'

Template.userMenuBtns.helpers({
    //renvoie la liste des projets ou l'utilisateur courant est admin
    adminProjects: function () {
        //on recupere tout les projets de l'utilisateur
        const currentUserProjects = Meteor.user().profile.projects
        let adminProjects = []
        //pour chacuns, on check si l'utilisateur est admin
        currentUserProjects.forEach(project => {
            if (project.roles.includes("admin")) {
                //et on ajoute au tableau repose a envoyer
                adminProjects.push(project)
            }
        })
        return adminProjects
    },
    isFollowedAuthor: function () {
        return Meteor.user().profile.followedAuthors.includes(Template.instance().data.userId)
    },
    pulse: function () {
        return Template.instance().pulse.get()
    }
});

Template.userMenuBtns.events({
    //au click sur le bouton d'invitation
    'click [inviteToProjects]': function () {
        $('.modal').modal();
        //on ouvre la fenetre modale puis on active le menu accordéon
        $('.invite-to-projects-modal').modal('open');
        Meteor.setTimeout(function () {
            $('.collapsible').collapsible();
        }, 150)
    },
    "click [projectName] a": function (event) {
        event.preventDefault()
    },
    'click [follow]': function (event, instance) {
        //on récupère l'utilisateur courant
        resetTooltips()
        let user = User.findOne({_id: Meteor.userId})
        //et on applique la méthode
        user.callMethod('followAuthor', instance.data.userId, (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("Vous êtes désormais abonné aux articles de cet utilisateur", 2000, 'green')
                $('#interactionBtn').click()
            }
        })
    },
    'click [unFollow]': function (event, instance) {
        resetTooltips()
        //on récupère l'utilisateur courant
        let user = User.findOne({_id: Meteor.userId})
        //et on applique la méthode
        user.callMethod('unFollowAuthor', instance.data.userId, (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("Vous n'êtes plus abonné aux articles de cet utilisateur", 2000, 'orange')
                $('#interactionBtn').click()
            }
        })
    },
    'click [newConversation]': function (event, instance) {
        resetTooltips()
        //on récupère l'utilisateur courant
        let currentUser = User.findOne({_id: Meteor.userId})
        //on recupere l'autre
        let otherSpeaker = User.findOne({_id: instance.data.userId})

        hubCrypto.generateNewConversationBrunchOfKeys(
            currentUser.profile.asymPublicKey,
            otherSpeaker.profile.asymPublicKey,
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
                shortenedOtherSpeakerEntity.name = otherSpeaker.username
                shortenedOtherSpeakerEntity.isProject = false
                shortenedOtherSpeakerEntity.imgUrl = otherSpeaker.profile.imgUrl
                shortenedOtherSpeakerEntity.speaker_id = otherSpeaker._id
                //et on applique la méthode
                conversation.callMethod('newConversation', shortenedCreatorEntity, shortenedOtherSpeakerEntity, brunchOfKeys, (error) => {
                    //si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        Materialize.toast("une erreur s'est produite", 4000, 'red')
                    } else {
                        $('#interactionBtn').click()
                        hubCrypto.decryptAndStoreInSesstionBrunchOfUserConversationKeys(() => {
                        })
                    }
                })
            }
        )

    }
});

Template.userMenuBtns.onCreated(function () {
    //add your statement here
    this.pulse = new ReactiveVar(true)
    Meteor.setTimeout(() => {
        this.pulse.set(false)
    }, 3000)
});

Template.userMenuBtns.onRendered(function () {
    //on active les infobulles
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
});

Template.userMenuBtns.onDestroyed(function () {
    //add your statement here
});

