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
    "submit #newInvitationForm": function (event, instance) {
        event.preventDefault()
        instance.newInvitationComplete.set([
            "Génération du lien d'invitation"
        ])
        let startTs = Date.now()
        let validityDuration = $("#validityDuration").val()
        let remaining = $("#remaining").val()
        let message = instance.showInvitMessage.get() ? $("#message").val() : ""
        let password = cryptoTools.generateRandomPassword()
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        let currentUserProject = projectController.getCurrentUserProject(FlowRouter.current().params.projectId)
        cryptoTools.generateSimKeyFromPassphrase(password, (simKey) => {
            cryptoTools.sim_encrypt_data(currentUserProject.asymEnc_projectSymKey, simKey, currentProject._id, (symEnc_projectSymKey) => {
                cryptoTools.sim_encrypt_data(message, simKey, currentProject._id, (symEnc_message) => {
                    cryptoTools.importSymKey(Session.get("currentProjectSimKey"), currentUserProject.asymEnc_projectName, (projectSimKey) => {
                        cryptoTools.sim_encrypt_data(password, projectSimKey, currentUserProject.asymEnc_projectName, (symEnc_invitationPassword) => {
                            let invitation = {
                                projectId: currentProject._id,
                                symEnc_message: cryptoTools.convertArrayBufferViewtoString(symEnc_message),
                                hashedPassword: cryptoTools.hash(password),
                                emittedBy: currentUserProject.asymEnc_memberId,
                                symEnc_projectSymKey: cryptoTools.convertArrayBufferViewtoString(symEnc_projectSymKey),
                                validityDuration: Number(validityDuration),
                                remaining: Number(remaining)
                            }
                            currentProject.callMethod(
                                "createInvitation",
                                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                                invitation, cryptoTools.convertArrayBufferViewtoString(symEnc_invitationPassword),
                                (err, invitationId) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        let duration = Date.now() - startTs
                                        let finish = () => {
                                            FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/invitation/" + invitationId)
                                        }
                                        if (duration < 1000) {
                                            finish()
                                        } else {
                                            Meteor.setTimeout(finish(), 1000 - duration)
                                        }
                                        console.log(invitationId)
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

