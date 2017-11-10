import Project from '/imports/classes/Project';
import User from '/imports/classes/User';
import Posts from '/lib/collections/Posts';

/******************************************
 * si l'utilisateur est l'utilisateur courant, on lui renvoi tout
 **********************************/
Meteor.publish('UserPrivateInfo', function (id) {
    check(id, String);
    if (id === this.userId)
        return Meteor.users.find(id);
});

/******************************************
 *si l'utilisateur n'est pas l'utilisateur courant, on lui renvoit que cetraines info publiques
 **********************************/
Meteor.publish('userPublicInfo', function (id) {
    check(id, String);
    userId = this.userId
    if(id !== userId) {
        return User.find({_id: id},
            {
                //liste des champs non renvoyés
                fields: {
                    createdAt: 0,
                    emails: 0,
                    services: 0,
                    "profile.location": 0,
                    "profile.projects": 0,
                    "profile.invitations" : 0,
                    "profile.notifications" : 0,
                }
            })
        //sinon, on renvoie tout
    }else if(id === userId){
        return Meteor.users.find({_id : id},{
            fields : {
                createdAt: 0,
                emails : 0,
                services : 0
            }
        });
    }
});

/******************************************
 *pour les projets, si l'utilisateur courant est admin,
 * on lui renvoi tout, sinon, on renvoie que les infos publiques
 **********************************/
Meteor.publish('singleProject', function (id) {
    check(id, String);
    let currentProject =  Project.find({_id: id});
  const currentUserId = this.userId
  if (currentUserId && currentProject.fetch()[0].isMember(currentUserId)) {
        return currentProject
    }else{
        return Project.find({_id: id},
            {
                fields: {
                    //liste des champs non renvoyés
                    createdAt: 0,
                    members: 0,
                    invitations : 0
                }
            })
    }
});

Meteor.publish('miniature', function (id, type) {
    check(id, String);
    check(type, String);
    if(type === "user") {
        return User.find({_id: id},
            {
                //liste des champs non renvoyés
                fields: {
                    createdAt: 0,
                    emails: 0,
                    services: 0,
                    "profile.location": 0,
                    "profile.projects": 0,
                    "profile.description" : 0,
                    "profile.notifications" : 0,
                }
            })
    }else if(type === "project"){
        return Project.find({_id: id},
            {
                //liste des champs non renvoyés
                fields: {
                    createdAt: 0,
                    members: 0,
                    services: 0,
                    invitations : 0,
                    "publicInfo.location" : 0
                }
            })
    }
});
Meteor.publish('posts', function () {
    return Posts.find()
});

if(Meteor.isDevelopment){
    Meteor.publish('AllForDev', function () {
        return [Project.find(), User.find()]
    } )
}
