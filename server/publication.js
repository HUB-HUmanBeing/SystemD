import Project from '/imports/classes/Project';
import User from '/imports/classes/User';

Meteor.publish('UserPrivateInfo', function (id) {
    check(id, String);
    if (id === Meteor.userId())
        return Meteor.users.find(id);
});

Meteor.publish('userPublicInfo', function (id) {
    check(id, String);
    if(id !== Meteor.userId()) {
        return User.find({_id: id},
            {
                fields: {
                    createdAt: 0,
                    emails: 0,
                    services: 0,
                    "profile.location": 0,
                    "profile.projects": 0
                }
            })
    }else if(id === Meteor.userId()){
        return Meteor.users.find(id);
    }
});



Meteor.publish('singleProject', function (id) {
    check(id, String);
    let currentProject =  Project.find({_id: id});
    if(currentProject.fetch()[0].isAdmin(Meteor.userId())){
        return currentProject
    }else{
        return Project.find({_id: id},
            {
                fields: {
                    createdAt: 0,
                    members: 0,
                    services: 0,
                    "publicInfo.location" : 0
                }
            })
    }
});