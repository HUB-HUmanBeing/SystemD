import projectController from "../../../../lib/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Project from "../../../../../imports/classes/Project";
import Invitation from "../../../../../imports/classes/Invitation";
import QRious from 'qrious'
import moment from "moment";

Template.showInvitation.helpers({
    //add you helpers here
    invitation: function () {
        return Invitation.findOne(Template.instance().invitationId)
    },
    currentProject: function () {
        return Project.findOne(Template.instance().projectId)
    },
    magicLink: function () {
        let magicLink = Template.instance().magicLink.get()
        if (magicLink) {
            const qr = new QRious({
                element: document.getElementById('qrCode'),
                value: magicLink,
                level: "Q",
                background: "#ffffff",
                foreground: "#263238",
                size: 300,

            })
        }
        return magicLink
    },
    copied: function () {
        return Template.instance().copied.get()
    },
    decryptedMessage: function () {
        return Template.instance().decryptedMessage.get()
    },
    validityDurationLeft: function () {
        let invitation = Invitation.findOne(Template.instance().invitationId)
        let serverDate = Template.instance().serverDate.get()
        if (serverDate && invitation) {
            let elapsingDuration = new moment(invitation.createdAt).add(invitation.validityDuration, "h").diff(new moment(serverDate))
            return moment.duration(elapsingDuration).humanize()
        }

    }
});

Template.showInvitation.events({
    //add your events here
    "click [copyMagicLink]": function (event, instance) {
        const el = document.createElement('textarea');
        el.value = instance.magicLink.get();
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        Materialize.toast(__("showInvitation.copied"), 6000, "lighter-bg")
        instance.copied.set(true)
    },
    "click [share]": function (event, instance) {
        if (navigator.share) {

            navigator.share({
                title: __("showInvitation.invitTitle") + " " + projectController.getCurrentUserProject(instance.projectId).asymEnc_projectName,
                text: __("showInvitation.invitMessage"),
                url: instance.magicLink.get(),
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
    },
    "click [deleteInvitation]": function (event, instance) {
        event.preventDefault()
        let project = Project.findOne(instance.projectId)
        project.callMethod(
            "deleteInvitation",
            projectController.getAuthInfo(instance.projectId),
            instance.invitationId,
            (err, res) => {
                if(err){
                    console.log(err)
                }else{
                    Materialize.toast(__("showInvitation.deleted"),6000, "lighter-bg")
                    FlowRouter.go('/project/'+instance.projectId+'/params')
                }
            })
    }
})
;

Template.showInvitation.onCreated(function () {
    //add your statement here
    this.projectId = FlowRouter.current().params.projectId
    this.invitationId = FlowRouter.current().params.invitationId
    this.decryptedInvitPassword = new ReactiveVar(null)
    this.magicLink = new ReactiveVar("")
    this.serverDate = new ReactiveVar()
    this.decryptedMessage = new ReactiveVar("")
    this.copied = new ReactiveVar(false)
    //on récupere la date du serveur
    Meteor.call("getServerDate", (err, date) => {
        if (err) {
            console.log(err)
        } else {
            this.serverDate.set(date)
        }
    })
    //récupération et déchiffrement de l'invitation
    Tracker.autorun(() => {
        let currentUserProject = projectController.getCurrentUserProject(this.projectId)
        if (currentUserProject) {
            //on récupere le projet courant et la clef d'invitation chiffrée
            let currentProject = Project.findOne(this.projectId)
            let currentInvitationPassword = null
            if (currentProject.private.invitations.length) {
                currentProject.private.invitations.forEach(projectInvitation => {
                    if (projectInvitation.invitationId === this.invitationId) {
                        currentInvitationPassword = projectInvitation.symEnc_invitationPassword
                    }
                })
            }
            if (currentInvitationPassword) {
                //on déchiffre la clef d'invitation
                cryptoTools.importSymKey(Session.get("currentProjectSimKey"), currentProject.name, projectSymKey => {
                    cryptoTools.sim_decrypt_data(cryptoTools.convertStringToArrayBufferView(currentInvitationPassword), projectSymKey, currentProject.name, (decryptedInvitPassword) => {
                        this.decryptedInvitPassword.set(decryptedInvitPassword)
                        this.magicLink.set(Meteor.absoluteUrl() + "invitation/" + this.invitationId + "&password=" + decryptedInvitPassword)
                        //on souscrit à l'invitation
                        Meteor.subscribe('invitation', this.invitationId, cryptoTools.hash(decryptedInvitPassword), (err) => {
                            if (err) {
                                console.log(err)

                            } else {
                                //on déchiffre le message d'invitation
                                let symEnc_message = Invitation.findOne(this.invitationId).symEnc_message
                                cryptoTools.generateSimKeyFromPassphrase(decryptedInvitPassword, (invitationSymKey) => {
                                    cryptoTools.sim_decrypt_data(cryptoTools.convertStringToArrayBufferView(symEnc_message), invitationSymKey, currentProject._id, (decryptedMessage) => {
                                        this.decryptedMessage.set(decryptedMessage)
                                    })
                                })

                            }
                        })
                    })
                })
            }
        }
    })

});

Template.showInvitation.onRendered(function () {
    //add your statement here
});

Template.showInvitation.onDestroyed(function () {
    //add your statement here
});

