import Project from "../imports/classes/Project";
import Projects from "../lib/collections/Projects";
import Invitation from "../imports/classes/Invitation";
import cryptoServer from "../imports/cryptoServer";
import Invitations from "../lib/collections/Invitations";
import {check} from "meteor/check";
import ProjectNotifications from "../lib/collections/ProjectNotifications";
import Topics from "../lib/collections/Topics";
import Publications from "../lib/collections/Publications";
import Topic from "../imports/classes/Topic";
import Publication from "../imports/classes/Publication";
import Comments from "../lib/collections/Comments";
import MapMarkers from "../lib/collections/MapMarkers";
import MapMarker from "../imports/classes/MapMarker";
import Activities from "../lib/collections/Activities";
import ProjectFiles from "../lib/collections/ProjectFiles";
import Spreadsheets from "../lib/collections/Spreadsheets";
import Pads from "../lib/collections/Pads";
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
Meteor.publish('topics', function (authInfo, projectId, categoryId, limit) {
    check(authInfo, {memberId: String, userSignature: String})
    check(projectId, String)
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    check(categoryId, String)
    check(limit, Number)

    return Topics.find({
            "$and": [
                {projectId: projectId},
                {categoryId: categoryId}
            ]
        }, {
            limit: limit,
            sort: {
                lastActivity: -1
            }
        }
    )
})
Meteor.publish('mainTopic', function (authInfo, projectId) {
    check(authInfo, {memberId: String, userSignature: String})
    check(projectId, String)
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return Topics.find({
        "$and": [{
            projectId: projectId
        }, {
            isMainTopic: true
        }]
    })
})
Meteor.publish('singleTopic', function (authInfo, topicId, projectId) {

    check(topicId, String)
    check(projectId, String)
    let topicCursor = Topics.find({_id: topicId})
    check(authInfo, {memberId: String, userSignature: String})
    projectId = topicCursor.fetch()[0].projectId
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return topicCursor
})

Meteor.publish("publications", function (authInfo, topicId, projectId, limit) {

    check(topicId, String)
    check(limit, Number)
    check(projectId, String)
    let topic
    topic = Topic.findOne({_id: topicId})
    check(authInfo, {memberId: String, userSignature: String})
    projectId = topic.projectId
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    topic.seenByAdd(authInfo.memberId)
    topic.save()
    return Publications.find({
        $and: [
            {topicId: topic._id},
            {pinned: false}]
    }, {
        limit: limit,
        sort: {
            createdAt: -1
        }
    })
})
Meteor.publish("pinnedPublication", function (authInfo, topicId) {

    check(topicId, String)
    let topic
    topic = Topic.findOne({_id: topicId})
    check(authInfo, {memberId: String, userSignature: String})
    let projectId = topic.projectId
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return Publications.find({
        $and: [
            {topicId: topic._id},
            {pinned: true}]
    }, {})
})
Meteor.publish("rootComments", function (authInfo, publicationId, limit) {
    check(publicationId, String)
    check(limit, Number)
    let publication = Publication.findOne({_id: publicationId})
    check(authInfo, {memberId: String, userSignature: String})
    let projectId = publication.projectId
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return Comments.find({publicationId: publicationId, isRootComment: true}, {
        limit: limit,
        sort: {
            createdAt: -1
        }
    })
})
Meteor.publish("subComments", function (authInfo, commentId, limit) {
    check(commentId, String)
    check(limit, Number)
    let comment = Comments.findOne({_id: commentId})
    check(authInfo, {memberId: String, userSignature: String})
    let projectId = comment.projectId
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return Comments.find({commentId: commentId, isRootComment: false}, {
        limit: limit,
        sort: {
            createdAt: -1
        }
    })
})
Meteor.publish('mapMarkers', function (authInfo, projectId) {
        check(projectId, String)
        check(authInfo, {memberId: String, userSignature: String})
        let currentProject = Project.findOne(projectId)
        check(currentProject.isMember(authInfo), true)
        return MapMarkers.find({projectId: projectId}, {
            sort: {
                createdAt: -1
            }
        })
    }
)
Meteor.publish('markerDetail', function (authInfo, markerId) {
    check(markerId, String)
    check(authInfo, {memberId: String, userSignature: String})
    let projectId = MapMarker.findOne(markerId).projectId
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return MapMarkers.find({_id: markerId})
})
Meteor.publish("CalendarActivitiesByProject", function (authInfo, projectId) {
    check(projectId, String)
    check(authInfo, {memberId: String, userSignature: String})
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return Activities.find({projectId: projectId, start: {$exists: true}}, {
        sort: {
            createdAt: -1
        }
    })
})
Meteor.publish("mapActivitiesByProject", function (authInfo, projectId) {
    check(projectId, String)
    check(authInfo, {memberId: String, userSignature: String})
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return Activities.find({projectId: projectId, symEnc_coordinates: {$exists: true}}, {})
})
Meteor.publish("activitiesProject", function (authInfo, projectId) {
    check(projectId, String)
    check(authInfo, {memberId: String, userSignature: String})
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    return Activities.find({projectId: projectId}, {})
})
Meteor.publish("publicationFiles", function (authInfo, projectId, filesId) {
    check(projectId, String)
    check(authInfo, {memberId: String, userSignature: String})
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    check(filesId, [String])
    return ProjectFiles.find({
        $and:
            [
                {projectId: projectId},
                {_id: {$in: filesId}}
            ]
    })
})
Meteor.publish("projectFiles", function (authInfo, projectId, parentFolderId, limit) {
    check(projectId, String)
    check(parentFolderId, String)
    check(authInfo, {memberId: String, userSignature: String})
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    if (parentFolderId == "root") {
        parentFolderId = {$in: ["root", null]}
    }
    return ProjectFiles.find(
        {
            projectId: projectId,
            parentFolderId: parentFolderId
        }, {
            limit: limit,
            sort: {
                createdAt: -1
            }
        }
    )
})
Meteor.publish('spreadsheets', function (authInfo, projectId, categoryId, limit) {
    check(authInfo, {memberId: String, userSignature: String})
    check(projectId, String)
    check(categoryId, String)
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    check(limit, Number)

    return Spreadsheets.find({
            "$and": [
                {projectId: projectId},
                {categoryId: categoryId ? categoryId : {$in: ["", null]}}
            ]
        }, {
            limit: limit,
            sort: {
                lastActivity: -1
            },
            fields: {
                _id: 1,
                symEnc_name: 1,
                lastActivity: 1,
                projectId: 1,
                categoryId: 1,

            }
        }
    )
})
Meteor.publish('singleSpreadsheet', function (authInfo, spreadsheetId) {

    check(spreadsheetId, String)
    let SpreadsheetCursor = Spreadsheets.find({_id: spreadsheetId})
    check(authInfo, {memberId: String, userSignature: String})

    if (SpreadsheetCursor.fetch()[0]) {
        let projectId = SpreadsheetCursor.fetch()[0].projectId
        let currentProject = Project.findOne(projectId)
        check(currentProject.isMember(authInfo), true)
        return SpreadsheetCursor
    }

})
Meteor.publish('pads', function (authInfo, projectId, categoryId, limit) {
    check(authInfo, {memberId: String, userSignature: String})
    check(projectId, String)
    check(categoryId, String)
    let currentProject = Project.findOne(projectId)
    check(currentProject.isMember(authInfo), true)
    check(limit, Number)

    return Pads.find({
            "$and": [
                {projectId: projectId},
                {categoryId: categoryId ? categoryId : {$in: ["", null]}}
            ]
        }, {
            limit: limit,
            sort: {
                lastActivity: -1
            },
            fields: {
                _id: 1,
                symEnc_name: 1,
                lastActivity: 1,
                projectId: 1,
                categoryId: 1,
                createdBy: 1,

            }
        }
    )
})
Meteor.publish('singlePad', function (authInfo, padId) {

    check(padId, String)
    let PadCursor = Pads.find({_id: padId}, {
        fields: {
            _id: 1,
            symEnc_name: 1,
            lastActivity: 1,
            projectId: 1,
            categoryId: 1,
            changes: 1,
            cursors: 1,
            createdBy: 1,
        }
    })
    check(authInfo, {memberId: String, userSignature: String})

    if (PadCursor.fetch()[0]) {
        let projectId = PadCursor.fetch()[0].projectId
        let currentProject = Project.findOne(projectId)
        check(currentProject.isMember(authInfo), true)
        return PadCursor
    }

})

