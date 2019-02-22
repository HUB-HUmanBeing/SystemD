import User from '/imports/classes/User';
import Project from "../imports/classes/Project";
import Projects from "../lib/collections/Project";

/******************************************
 * si l'utilisateur est l'utilisateur courant, on lui renvoi tout
 **********************************/
Meteor.publish('UserPrivateInfo', function (id) {
    check(id, String);
    if (id === this.userId)
        return Meteor.users.find(id, {fields: {private: 1, public: 1, username: 1}});
});

Meteor.publish('ProjectForMembers', function (projectId, hashedSymKey) {
    check(projectId, String)
    check(hashedSymKey, String)

    const project = Project.findOne(projectId)
    if (project.private.hashedSymKey === hashedSymKey) {
        return Projects.find({_id: projectId},
            {
                fields: {
                    _id:1,
                    name:1,
                    public: 1,
                    "private.createdAt": 1,
                    "private.symEnc_AsymPrivateKey":1,

                    "private.members.memberId": 1,
                    "private.members.role": 1,
                    "private.members.symEnc_username": 1,
                    "private.members.symEnc_userId": 1,
                    "private.members.symEnc_joinAtTs": 1,
                }
            })
    }
})
