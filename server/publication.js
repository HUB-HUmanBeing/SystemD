import Project from '/imports/classes/Project';
import User from '/imports/classes/User';
import Projects from '/lib/collections/Projects'
import Posts from '/lib/collections/Posts';
import PostComments from "/lib/collections/PostComments"

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
                    'profile.followedAuthors': 0,
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
    }
});
/***************************************
 * publication pour les miniatures
 */
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
                    'profile.invitations': 0,
                    'profile.followedAuthors': 0,
                    'profile.competences': 0,
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
                    'publicInfo.location': 0,
                    'publicInfo.description': 0
                }
            });
    }
});
/**************************************
 * Publication des posts d'un projet ou d'un utilisateur spécifique
 */
Meteor.publish('PostsInfinite', function (limit, query) {

    check(limit, Number);
    check(query, Object)
    check(query.isProject, Boolean)
    check(query.author_id, String)
    //on renvoie les posts du projet
    return Posts.find({isProject: query.isProject, author_id: query.author_id}, {
        limit: limit,
        //et on les trie par date décroissantes (les plus récents en premiers
        sort: {
            pinned: -1,
            createdAt: -1
        }
    });
});
/*****************************
 * publication du fil d'actu principal
 */
Meteor.publish('HomepagePostInfiniteSubs', function (limit, lonLat, range) {
//on check les arguments
    check(limit, Number);
    check(lonLat, [Number]);
    check(range, Number)
    //on décrit le selecteur géo
    let geo
    if (range === 600) { //si le curseur etait au max, on passe le selecteur a tout (vu qu'on l'applique dans un $and)
        geo = {}
    } else {
        geo = {
            lonLat: {
                "$geoWithin": {
                    "$center": [
                        lonLat,
                        range / 111.12
                    ]
                }
            }
        }
    }
    //verification des auteurs suivis
    let userId = Meteor.userId()
    let followedAuthors = []
    if (userId) {
        let currentUserProfile = Meteor.user().profile
        followedAuthors = currentUserProfile.followedAuthors
    }

    let limitDate = new Date(new Date().setDate(new Date().getDate() - 10)) //(il y a dix jours)
    //todo affiner la recherche avec des scrores sur le parametre folowed author et autre
    //puis on renvoie les resultat de la recherche
    return Posts.find({//les articles renvoyés
            "$or": [{ //sont soit
                author_id: {'$in': followedAuthors}//ceux dont l'auteur fait partie des auteurs suivis
            },//soit
                {
                    "$and": [ //validant simultanément les deux conditions suivantes
                        {createdAt: {"$gte": limitDate}},//crées avant la date limite
                        geo//validant les conditions géographiques
                    ]
                }]
        },
        {
            limit: limit,//on limite la requetes a notre limite pour l'infinite scroll
            sort: {//en les triant par dates décroissantes
                createdAt: -1,
            }
        });
});
/******************************
 * publication d'un post unique, utilisé pour mettre le focus sur un post particulier
 */
Meteor.publish('singlePost', function (id) {
    check(id, String)
    // Assign safe values to a new object after they have been validated
    return Posts.find({_id: id});
});

/**************************************
 * Publication des posts d'un projet ou d'un utilisateur spécifique
 */
Meteor.publish('CommentsInfinite', function (limit, post_id) {

    check(limit, Number);
    check(post_id, String)
    //on renvoie les commentaires du post
    return PostComments.find({post_id: post_id}, {
        limit: limit,
        //et on les trie par date décroissantes (les plus récents en premiers
        sort: {
            createdAt: -1
        }
    });
});
