import User from '/imports/classes/User';
import Project from "../imports/classes/Project";
import Projects from "../lib/collections/Projects";
import Invitation from "../imports/classes/Invitation";
import cryptoServer from "../imports/cryptoServer";
import Invitations from "../lib/collections/Invitations";
import {check} from "meteor/check";

/******************************************
 * si l'utilisateur est l'utilisateur courant, on lui renvoi tout
 **********************************/
Meteor.publish('UserPrivateInfo', function (id) {
    check(id, String);
    if (id === this.userId)
        return Meteor.users.find(id, {fields: {private: 1, public: 1, username: 1}});
});
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
Meteor.publish('invitation', function (invitationId, hashedPassword) {
    check(invitationId, String)
    check(hashedPassword, String)
    const invitation = Invitation.findOne(invitationId)
    if(invitation){
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
    }else{

        return []
    }

})

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
                this.removed("Invitations", invitationId)
                console.log("invitation auto-removed")
            })
        } else {
            invitationIds.push(invit.invitationId)
        }
    })
    return Invitations.find({"_id": {"$in": invitationIds}})
})

