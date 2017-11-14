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
    userId = this.userId;
    if (id !== userId) {
        return User.find({_id: id},
            {
                //liste des champs non renvoyés
                fields: {
                    createdAt: 0,
                    emails: 0,
                    services: 0,
                    'profile.location': 0,
                    'profile.projects': 0,
                    'profile.invitations': 0,
                    'profile.notifications': 0,
                }
            });
        //sinon, on renvoie tout
    } else if (id === userId) {
        return Meteor.users.find({_id: id}, {
            fields: {
                createdAt: 0,
                emails: 0,
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
    let currentProject = Project.find({_id: id});
    //On vérifie que le projet existe bien
    if (currentProject.fetch()[0]) {
        const currentUserId = this.userId;
        if (currentUserId && currentProject.fetch()[0].isMember(currentUserId)) {
            return currentProject;
        }
    } else {
        return Project.find({_id: id},
            {
                fields: {
                    //liste des champs non renvoyés
                    createdAt: 0,
                    members: 0,
                    invitations: 0
                }
            });
    }
});

Meteor.publish('miniature', function (id, type) {
    check(id, String);
    check(type, String);
    if (type === 'user') {
        return User.find({_id: id},
            {
                //liste des champs non renvoyés
                fields: {
                    createdAt: 0,
                    emails: 0,
                    services: 0,
                    'profile.location': 0,
                    'profile.projects': 0,
                    'profile.description': 0,
                    'profile.notifications': 0,
                }
            });
    } else if (type === 'project') {
        return Project.find({_id: id},
            {
                //liste des champs non renvoyés
                fields: {
                    createdAt: 0,
                    members: 0,
                    invitations: 0,
                    'publicInfo.location': 0
                }
            });
    }
});
Meteor.publish('PostsInfinite', function (limit, query) {

    check(limit, Number);
    check(query, Object)
    check(query.isProject, Boolean)
    check(query.author_id, String)
    // Assign safe values to a new object after they have been validated
    return Posts.find({isProject: query.isProject, author_id: query.author_id}, {
        limit: limit,
        // Using sort here is necessary to continue to use the Oplog Observe Driver!
        // https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver
        sort: {
            createdAt: -1
        }
    });
});

Meteor.publish('HomepagePostInfiniteSubs', function (limit, lonLat, range) {

    check(limit, Number);
    check(lonLat, [Number]);
    check(range, Number)
    console.log(range)
    let userId = Meteor.userId()
    limitDate = new Date() - 604800000 //(il y a une semaine)
    currentUserProfile = Meteor.user().profile
    // // Assign safe values to a new object after they have been validated
    return Posts.find({
            createdAt: {"$lt": limitDate},
            author_id: {
                "$all": currentUserProfile.followedAuthors
            },
            lonLat: {
                "$geoWithin": {
                    "$center": [
                        lonLat,
                        range / 111.12
                    ]
                }
            }
        },
        {
            limit: limit,
            // Using sort here is necessary to continue to use the Oplog Observe Driver!
            // https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver
            sort: {
                createdAt: -1
            }
        });
});
Meteor.publish('singlePost', function (id) {
    check(id, String)
    // Assign safe values to a new object after they have been validated
    return Posts.find({_id: id});
});


if (Meteor.isDevelopment) {
    Meteor.publish('AllForDev', function () {
        return [Project.find(), User.find()];
    });
}
