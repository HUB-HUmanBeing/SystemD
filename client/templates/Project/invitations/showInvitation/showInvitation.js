import projectController from "../../../../lib/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Project from "../../../../../imports/classes/Project";
import Invitation from "../../../../../imports/classes/Invitation";
import QRious from 'qrious'

Template.showInvitation.helpers({
    //add you helpers here
    invitation: function () {
        return Invitation.findOne(Template.instance().invitationId)
    },
    currentProject: function () {
        return Project.findOne(Template.instance().projectId)
    },
    magicLink: function () {
        let magicLink =Template.instance().magicLink.get()
        if(magicLink){
            const qr = new QRious({
                element: document.getElementById('qrCode'),
                value: magicLink,
                level:"Q",
                background:"#ffffff",
                foreground:"#263238",
                size: 180,

            })
        }
console.log(magicLink)
        return magicLink
    }
});

Template.showInvitation.events({
    //add your events here
});

Template.showInvitation.onCreated(function () {
    //add your statement here
    this.projectId = FlowRouter.current().params.projectId
    this.invitationId = FlowRouter.current().params.invitationId
    this.decryptedInvitPassword = new ReactiveVar(null)
    this.magicLink = new ReactiveVar("")

    Tracker.autorun(() => {
        let currentUserProject = projectController.getCurrentUserProject(this.projectId)
        if (currentUserProject) {
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
                cryptoTools.importSymKey(Session.get("currentProjectSimKey"), currentProject.name, projectSymKey => {
                    cryptoTools.sim_decrypt_data(cryptoTools.convertStringToArrayBufferView(currentInvitationPassword), projectSymKey, currentProject.name, (decryptedInvitPassword) => {
                        this.decryptedInvitPassword.set(decryptedInvitPassword)
                        this.magicLink.set(Meteor.absoluteUrl()+"invitation/"+this.invitationId+"&password="+decryptedInvitPassword)
                        Meteor.subscribe('invitation', this.invitationId, cryptoTools.hash(decryptedInvitPassword), (err) => {
                            if (err) {
                                console.log(err)
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

