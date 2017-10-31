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
        return Project.find({_id: this.params._id})

    }
})

/********************************
 * page d'administation d'un projet, les infos sont disponibles
 * a tout les membres, éditables par les admins du projet
 */
Router.route('/project/:_id/admin/', {
    name: 'adminProject',
    // on verifie que l'utilisateur est membre du projet
    onBeforeAction : function () {
        if(Meteor.userId()){
            let project = Project.findOne({_id: this.params._id})
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
})

/********************************************
 * page d'organisation du projet, avec liste de tache et agenda
 */
Router.route('/project/:_id/organise/', {
    name: 'orgProject',
    //on vérifie que l'utilisateur est membre du projet
    onBeforeAction : function () {
        if(Meteor.userId()){
            let project = Project.findOne({_id: this.params._id})
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
})
