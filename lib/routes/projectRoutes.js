import Project from '/imports/classes/Project';

/********************
 * page de présentation publique d'un projet
 */
Router.route('/project/:_id', {
    name: 'projectMainPage',
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.findOne({_id: this.params._id})

    }
});

/********************************
 * page d'administation d'un projet, les infos sont disponibles
 * a tout les membres, éditables par les admins du projet
 */
Router.route('/project/:_id/admin/', {
    name: 'adminProject',
    // On souscrit au projet
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },

    action: function () {
        //On récupère le projet par son id
        let project = Project.findOne({_id: this.params._id});
        //On vérifie si le projet existe
        if (project) {
            //On récupère l'utilisateur actuel
            let currentUser = Meteor.userId();
            //On vérifie si l'utilisateur actuel est loggé et si il fait parti du projet
            if (currentUser && project.isMember(currentUser)) {
                //Si oui on affiche le template
                this.render();
            } else {
                //Sinon on affiche "le template accès refusé"
                this.render('accessDenied');
            }
        } else {
            //Si le projet n'existe pas on affiche le template "non trouvé"
            this.render('notFound');
        }
    },
    //On retourne les données du projet au template
    data: function () {
        return Project.find({_id: this.params._id})
    }
});

/********************************************
 * page d'organisation du projet, avec liste de tache et agenda
 */
Router.route('/project/:_id/organise/', {
    name: 'orgProject',
    //on vérifie que l'utilisateur est membre du projet
    onBeforeAction : function () {
        if(Meteor.userId()){
            let project = Project.findOne({_id: this.params._id});
            if (!project.isMember(Meteor.userId())) {
                this.render('accessDenied');
            } else {
                this.next();
            }
        }else{
            this.render('accessDenied');
        }
    } ,
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.find({_id: this.params._id})

    }
});


/***************************************
 * accès a la gestion des ressources  du projet
 ***************************************/
Router.route('/project/:_id/resources/', {
    name: 'resourcesProject',
    //on vérifie que l'utilisateur est membre du projet
    onBeforeAction : function () {
        if(Meteor.userId()){
            let project = Project.findOne({_id: this.params._id});
            if (!project.isMember(Meteor.userId())) {
                this.render('accessDenied');
            } else {
                this.next();
            }
        }else{
            this.render('accessDenied');
        }
    } ,
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.find({_id: this.params._id})

    }
});


/***************************************
 * accès a la messagerie du projet
 ***************************************/
Router.route('/project/:_id/messages/', {
    name: 'messagesProject',
    //on vérifie que l'utilisateur est membre du projet
    onBeforeAction : function () {
        if(Meteor.userId()){
            let project = Project.findOne({_id: this.params._id});
            if (!project.isMember(Meteor.userId())) {
                this.render('accessDenied');
            } else {
                this.next();
            }
        }else{
            this.render('accessDenied');
        }
    } ,
    waitOn: function () {
        return Meteor.subscribe('singleProject', this.params._id);
    },
    data: function () {
        return Project.find({_id: this.params._id})

    }
});
