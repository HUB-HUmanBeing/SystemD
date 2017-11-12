import Project from '/imports/classes/Project';
import isUserMember from '/lib/routes/customControllers/isUserMember.js';

/********************
 * page de présentation publique d'un projet
 */
Router.route('/project/:_id', {
  name: 'projectMainPage',
  template: 'projectPage',
  yieldRegions: {
    'projectMainPage': {to: 'projectSection'}
  },
  waitOn: function () {
    return Meteor.subscribe('singleProject', this.params._id);
  },
  onBeforeAction: function () {
    //On récupère le projet par son id
    let project = Project.findOne({_id: this.params._id});
    //On vérifie si le projet existe
    if (!project) {
      //Si il n'existe pas on affiche le template "non trouvé"
      this.render('notFound');
    } else {
      //Si oui on affiche le template
      this.next();
    }
  },
  data: function () {
    return Project.findOne({_id: this.params._id});
  },
});

/********************************
 * page d'administation d'un projet, les infos sont disponibles
 * a tout les membres, éditables par les admins du projet
 */
Router.route('/project/:_id/admin/', {
  name: 'adminProject',
  template: 'projectPage',
  controller: isUserMember,
  yieldRegions: {
    'adminProject': {to: 'projectSection'}
  },
  // On souscrit au projet
  waitOn: function () {
    return Meteor.subscribe('singleProject', this.params._id);
  },

  //On retourne les données du projet au template
  data: function () {
    return Project.findOne({_id: this.params._id});
  },

});

/********************************************
 * page d'organisation du projet, avec liste de tache et agenda
 */
Router.route('/project/:_id/organise/', {
  name: 'orgProject',
  template: 'projectPage',
  yieldRegions: {
    'orgProject': {to: 'projectSection'}
  },
  waitOn: function () {
    return Meteor.subscribe('singleProject', this.params._id);
  },
  data: function () {
    return Project.findOne({_id: this.params._id});
  },

});

/***************************************
 * accès a la gestion des ressources  du projet
 ***************************************/
Router.route('/project/:_id/resources/', {
  name: 'resourcesProject',
  template: 'projectPage',
  controller: isUserMember,
  yieldRegions: {
    'resourcesProject': {to: 'projectSection'}
  },
  waitOn: function () {
    return Meteor.subscribe('singleProject', this.params._id);
  },
  data: function () {
    return Project.findOne({_id: this.params._id});
  },

});

/***************************************
 * accès a la messagerie du projet
 ***************************************/
Router.route('/project/:_id/messages/', {
  name: 'messagesProject',
  template: 'projectPage',
  controller: isUserMember,
  yieldRegions: {
    'messagesProject': {to: 'projectSection'}
  },
  waitOn: function () {
    return Meteor.subscribe('singleProject', this.params._id);
  },
  data: function () {
    return Project.findOne({_id: this.params._id});
  }
});
