import Project from "../../../../../imports/classes/Project";
import cryptoTools from "../../../../lib/cryptoTools";
import projectController from "../../../../lib/projectController";
import moment from 'moment'

Template.newInvitation.helpers({
    //add you helpers here
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    remaining: function () {
        return Template.instance().remaining.get()
    },
    showInvitMessage: function () {
        return Template.instance().showInvitMessage.get()
    },
    validityDurationOptions: function () {
        return [
            {
                value: 1,
                label: "1 " + __("newInvitation.hour")
            },
            {
                value: 24,
                label: "1 " + __("newInvitation.day")
            },
            {
                value: 24 * 7,
                label: "1 " + __("newInvitation.week")
            },
            {
                value: 24 * 30,
                label: "1 " + __("newInvitation.month")
            }
        ]
    },
    newInvitationComplete: function () {
        return Template.instance().newInvitationComplete.get()
    }
});

Template.newInvitation.events({
    //add your events here
    "change #remaining": function (event, instance) {
        instance.remaining.set(event.target.value)
    },
    "change [addMessage]": function (event, instance) {
        instance.showInvitMessage.set(!instance.showInvitMessage.get())
        Meteor.setTimeout(() => {
            $("textarea").focus()
        }, 200)
    },
    //on subbmit of a new invitation
    "submit #newInvitationForm": function (event, instance) {
        event.preventDefault()
        //we show the loader
        instance.newInvitationComplete.set([
            "Génération du lien d'invitation"
        ])
        //on garde en memoire le timestamp de début de l'opération
        let startTs = Date.now()
        //on récupere les infos du formulaire
        let validityDuration = $("#validityDuration").val()
        let remaining = $("#remaining").val()
        let message = instance.showInvitMessage.get() ? $("#message").val() : ""
        //on génère un password d'invitation (celui contenu dans le lien
        let password = cryptoTools.generateRandomPassword()
        //on récupere le projet et l'userProject courant
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        let currentUserProject = projectController.getCurrentUserProject(FlowRouter.current().params.projectId)
        //on génere une clefs a partir du password généré
        cryptoTools.generateSimKeyFromPassphrase(password, (simKey) => {
            //on chiffre la clef de notre projet et le message avec cette clef issue du password
            cryptoTools.sim_encrypt_data(currentUserProject.asymEnc_projectSymKey, simKey, currentProject._id, (symEnc_projectSymKey) => {
                cryptoTools.sim_encrypt_data(message, simKey, currentProject._id, (symEnc_message) => {
                    //on chiffre ensuite ce password avec notre clef symétrique de projet (pour pouvoir le stocker en base et le récuperer
                    cryptoTools.importSymKey(Session.get("currentProjectSimKey"), currentUserProject.asymEnc_projectName, (projectSimKey) => {
                        cryptoTools.sim_encrypt_data(password, projectSimKey, currentUserProject.asymEnc_projectName, (symEnc_invitationPassword) => {
                            //on prépare notre objet invitation a transmettre à la methode
                            let invitation = {
                                projectId: currentProject._id,
                                symEnc_message: cryptoTools.convertArrayBufferViewtoString(symEnc_message),
                                hashedPassword: cryptoTools.hash(password),
                                emittedBy: currentUserProject.asymEnc_memberId,
                                symEnc_projectSymKey: cryptoTools.convertArrayBufferViewtoString(symEnc_projectSymKey),
                                validityDuration: Number(validityDuration),
                                remaining: Number(remaining)
                            }
                            //et on crée l'invitation
                            currentProject.callMethod(
                                "createInvitation",
                                //on s'authentifie
                                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                                invitation, cryptoTools.convertArrayBufferViewtoString(symEnc_invitationPassword),
                                (err, invitationId) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        //si tout se passe bien, on mesure le temps écoulé et on attends le temps nécessaire avant de rediriger l'utilisateur sur l'invitation crée
                                        let duration = Date.now() - startTs
                                        let finish = () => {
                                            FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/invitation/" + invitationId)
                                        }
                                        if (duration < 1000) {
                                            finish()
                                        } else {
                                            Meteor.setTimeout(finish(), 1000 - duration)
                                        }
                                    }
                                })
                        })
                    })
                })


            })
        })
    }
});

Template.newInvitation.onCreated(function () {
    //add your statement here
    this.remaining = new ReactiveVar(1)
    this.showInvitMessage = new ReactiveVar(false)
    this.newInvitationComplete = new ReactiveVar(undefined)
});

Template.newInvitation.onRendered(function () {
    //add your statement here
    $('select').material_select();
    $('#message').characterCounter();
});

Template.newInvitation.onDestroyed(function () {
    //add your statement here
});

