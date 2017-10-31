import User from '/imports/classes/User';
/**************************
 * page d'edition du profile perso d'un utilisateur
 */
Router.route('/user/my_profile', {
    name: 'userSelfProfile',
    //on verifie que l'utilisateur est loggé
    onBeforeAction : function () {
        if (!Meteor.user()) {
            this.render('accessDenied');
        } else {
            this.next();
        }
    },
    waitOn: function () {
        return Meteor.subscribe('UserPrivateInfo', Meteor.userId())
    },
});

/*****************************
 * page de visualisation/gestion projets et des invitations d'un utilisateur
 */
Router.route('/user/my_projects', {
    name: 'userSelfProjects',
    //on verifie que l'utilisateur est loggé
    onBeforeAction : function () {
        if (!Meteor.user()) {
            this.render('accessDenied');
        } else {
            this.next();
        }
    },
    waitOn: function () {
        return Meteor.subscribe('UserPrivateInfo', Meteor.userId())
    }
});

/***********************************
 * page de presentation des infos publiques d'un utilisateurs et des messages de son blog
 */
Router.route('/user/:_id', {
    name: 'userMainPage',
    waitOn: function () {
        return Meteor.subscribe('userPublicInfo', this.params._id)
    },
    data: function () {
        return User.find({_id: this.params._id})
    }
});
