import User from '/imports/classes/User';
import Project from "../imports/classes/Project";
import Projects from "../lib/collections/Projects";
import Invitation from "../imports/classes/Invitation";
import cryptoServer from "../imports/cryptoServer";
import Invitations from "../lib/collections/Invitations";
import {check} from "meteor/check";
import ProjectNotifications from "../lib/collections/ProjectNotifications";
import NotifPush from "../imports/NotifPush";

/******************************************
 * si l'utilisateur est l'utilisateur courant, on lui renvoi tout
 **********************************/
/************
 * pulication des infos utilisateurs destinée à l'utilisateur courant
 */
Meteor.publish('UserPrivateInfo', function (id) {
    check(id, String);
    check(id === Meteor.userId(), true)
    return Meteor.users.find(id, {fields: {_id: 1, private: 1, public: 1, username: 1}});
});
/***************
 * publication des infos utilisateur publiques
 */
Meteor.publish('userPublicInfo', function (id) {
    check(id, String);
    return Meteor.users.find(id, {fields: {_id: 1, public: 1, username: 1}});
})

/***********************
 * publication de la partie publique d'un projet
 */
Meteor.publish('ProjectPublic', function (projectId) {
    check(projectId, String)
    return Projects.find({_id: projectId},
        {
            fields: {
                _id: 1,
                name: 1,
                public: 1,
            }
        })

})
/*******************
 * publication de la partie rivée d'un projet
 */
Meteor.publish('ProjectForMembers', function (projectId, hashedSymKey) {
    check(projectId, String)
    check(hashedSymKey, String)

    const project = Project.findOne(projectId)
    if (project.private.hashedSymKey === hashedSymKey) {
        return Projects.find({_id: projectId},
            {
                // fields: {
                //     _id:1,
                //     name:1,
                //     public: 1,
                //     "private.createdAt": 1,
                //     "private.symEnc_asymPrivateKey":1,
                //
                //     "private.members.memberId": 1,
                //     "private.members.role": 1,
                //     "private.members.symEnc_username": 1,
                //     "private.members.symEnc_userId": 1,
                //     "private.members.symEnc_joinAtTs": 1,
                // }
            })
    }
})
/*********************
 * publication d'une invitation, nécessite d'envoyer le hash du password envoyée avec
 * gere aussi l'auto-destroy d'une invitation
 */
Meteor.publish('invitation', function (invitationId, hashedPassword) {
    check(invitationId, String)
    check(hashedPassword, String)
    const invitation = Invitation.findOne(invitationId)
    if (invitation) {
        check(cryptoServer.compare(hashedPassword, invitation.hashedPassword), true)
        if (!invitation.isAlwaysValable()) {
            console.log("removed")
            invitation.remove()
        }
        let currentProject = Project.findOne(invitation.projectId)
        if (!invitation.isAlwaysValable()) {

            currentProject.private.invitations.forEach((invit, i) => {
                if (invit.invitationId === invitationId) {
                    invitation.remove(() => {
                        currentProject.private.invitations.splice(i, 1)
                        currentProject.save()
                        this.removed("Invitations", invitationId)
                        console.log("invitation auto-removed")
                    })
                }
            })

        }
        return Invitations.find({_id: invitationId})
    } else {

        return []
    }

})

/*********
 * publication de la liste des invitations pour un projet donné
 * gere aussi l'auto-destroy d'une invitation
 */

Meteor.publish('invitationList', function (authInfo, projectId) {
    check(authInfo, {memberId: String, userSignature: String})
    check(projectId, String)
    let currentProject = Project.findOne(projectId)
    check(currentProject.isAdmin(authInfo), true)
    let invitationIds = []
    currentProject.private.invitations.forEach((invit, i) => {
        let invitation = Invitation.findOne(invit.invitationId)
        if (!invitation.isAlwaysValable()) {
            invitation.remove(() => {
                currentProject.private.invitations.splice(i, 1)
                currentProject.save()
                this.removed("Invitations", invit.invitationId)
                console.log("invitation auto-removed")
            })
        } else {
            invitationIds.push(invit.invitationId)
        }
    })
    return Invitations.find({"_id": {"$in": invitationIds}})
})
Meteor.publish("getProjectNotificationsForMember", function (authInfo, projectId) {
    check(authInfo, {memberId: String, userSignature: String})
    check(projectId, String)
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)

    return ProjectNotifications.find({
        "$and": [
            {projectId: projectId},
            {
                notifiedMembers: {
                    "$elemMatch":
                        {"$eq": authInfo.memberId}
                }
            }
        ]
    })
})

