import User from '/imports/classes/User';
import Project from "../imports/classes/Project";

/******************************************
 * si l'utilisateur est l'utilisateur courant, on lui renvoi tout
 **********************************/
Meteor.publish('UserPrivateInfo', function (id) {
    check(id, String);
    if (id === this.userId)
        return Meteor.users.find(id, { fields: { private: 1, public: 1, username:1 }});
});

Meteor.publish('ProjectForMembers', function( projectId, authInfos){
    check(projectId, String)
    check(authInfos, {
        memberId : String,
        userSignature : String
    })
    const project = Project.findOne(projectId)
    if(project && project.isMember(authInfos)){
        return project
    }
})
