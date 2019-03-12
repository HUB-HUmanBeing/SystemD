import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Invitation from "../../../imports/classes/Invitation";
import cryptoServer from "../../../imports/cryptoServer";
import User from "../../../imports/classes/User";
import ProjectNotification from "../../../imports/classes/ProjectNotification";


Invitation.extend({
    meteorMethods: {
        /***********************************
         * methode d'acceptation d'une invitation recue
         * @param hashedPassword
         * @param encryptedUserProjectToAdd
         * @param encryptedNewMember
         */
        acceptInvitation(hashedPassword, encryptedUserProjectToAdd, encryptedNewMember) {
            //on récupere toutes les entités et on check qu'elles existent bien
            let invitation = Invitation.findOne(this._id)
            check(!!invitation, true)
            let currentProject = Project.findOne(invitation.projectId)
            check(!!currentProject, true)
            let currentUser = User.findOne(Meteor.userId())
            check(!!currentUser, true)
            //on check que l'user a le bon password
            check(hashedPassword, String)
            check(cryptoServer.compare(hashedPassword, invitation.hashedPassword), true)
            //on check que les arguments soient valides
            check(encryptedUserProjectToAdd, {
                asymEnc_projectId: String,
                asymEnc_projectName: String,
                asymEnc_memberId: String,
                asymEnc_projectSymKey: String,
                asymEnc_role: String,
                asymEnc_adminPassword: String,
                hashedAdminSignature: String
            })
            check(encryptedNewMember, {
                memberId: String,
                symEnc_userId: String,
                symEnc_username: String,
                invitedBy: String,
                symEnc_joinAtTs: String,
                userSignature: String
            })
            encryptedNewMember.userSignature = cryptoServer.hash(encryptedNewMember.userSignature)
            //on ajoute le role de simple membre à notre membre
            encryptedNewMember.role = "member"
            //check que l'invit est toujours valable (temps et nombre restant)
            check(invitation.isAlwaysValable(), true)
            //on check que yavais bien le memberId dans l'invitation
            let memberIdWasInInvitation = false
            invitation.invitationMembers.forEach((invitMember, i) => {
                if (invitMember.memberId === encryptedNewMember.memberId) {
                    memberIdWasInInvitation = true
                    invitation.invitationMembers.splice(i, 1)
                }
            })
            check(memberIdWasInInvitation, true)
            //edit de l'invit
            invitation.remaining--
            //check que l'invite est bien dans les invits listées du projet et on la retire au passage
            let invitationWasInProjectInvitations = false
            currentProject.private.invitations.forEach((invit, i) => {
                if (invit.invitationId === invitation._id) {
                    invitationWasInProjectInvitations = true
                    if (invitation.remaining < 1) {
                        currentProject.private.invitations.splice(i, 1)
                    }
                }
            })

            check(invitationWasInProjectInvitations, true)
            //fonction à appeler après le save ou le remove de l'invitation
            let finish = (err) => {
                if (!err) {
                    //edit du projet
                    currentProject.private.members.push(encryptedNewMember)
                    currentProject.save((err2) => {
                        if (!err2) {
                            currentUser.private.projects.unshift(encryptedUserProjectToAdd)
                            currentUser.save()
                            let notif = new ProjectNotification({
                                projectId: currentProject._id,
                                notifiedMembers: currentProject.getAdminMemberIds(),
                                section: "members",
                                notifType:"acceptedInvitation",
                                url: "/project/"+currentProject._id+"/members",
                            })
                            notif.save()
                        }
                    })
                    //edit de l'user
                } else {
                    console.log(err)
                }
            }
            //on finit par save ou remove l'invitation suivant le cas puis à save notre user et notre projet en appelant la fonction finish
            if (invitation.remaining < 1) {
                invitation.remove(err => {
                    finish(err)
                })
            } else {
                invitation.save(err => {
                    finish(err)

                })
            }

        },
    }
})
