import User from '/imports/classes/User';
/**************************
 * page d'edition du profile perso d'un utilisateur
 */
Router.route('/user/my_profile', {
    name: 'userSelfProfile',
    // On spécifie le controller de route à utiliser
    // (vérifie si l'utilisateur est loggé, voir isUserLogged.js).
    controller: isUserLogged,
    action: function () {
        // On souscrit aux données privées de l'utilisateur actuel
        this.subscribe('UserPrivateInfo', this.currentUser).wait();
        if (this.ready) {
            // Quand la souscription est prète on affiche le template
            this.render();
        }
    },
});

/*****************************
 * page de visualisation/gestion projets et des invitations d'un utilisateur
 */
Router.route('/user/my_projects', {
    name: 'userSelfProjects',
    // On spécifie le controller de route à utiliser
    // (vérifie si l'utilisateur est loggé, voir isUserLogged.js).
    controller: isUserLogged,
    action: function () {
        // On souscrit aux données privées de l'utilisateur actuel
        this.subscribe('UserPrivateInfo', this.currentUser).wait();
        if (this.ready) {
            // Quand la souscription est prète on affiche le template
            this.render();
        }
    }
});
/**************************
 * page d'edition du profile perso d'un utilisateur
 */
Router.route('/user/my_blog', {
    name: 'userSelfBlog',
    // On spécifie le controller de route à utiliser
    // (vérifie si l'utilisateur est loggé, voir isUserLogged.js).
    controller: isUserLogged,
    action: function () {
        // On souscrit aux données privées de l'utilisateur actuel
        this.subscribe('UserPrivateInfo', this.currentUser).wait();
        if (this.ready) {
            // Quand la souscription est prète on affiche le template
            this.render();
        }
    },
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
