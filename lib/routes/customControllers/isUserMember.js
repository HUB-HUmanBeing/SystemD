import Project from '/imports/classes/Project';
import isUserLogged from '/lib/routes/customControllers/isUserLogged.js';

isUserMember = isUserLogged.extend({

  onBeforeAction: function () {
    //On récupère le projet par son id
    let project = Project.findOne({_id: this.params._id});
    //On vérifie que le projet existe
    if (!project) {
      //Si il n'existe pas on affiche le template "non trouvé"
      this.render('notFound');
    } else {
      //On vérifie si l'utilisateur actuel est membre du projet
      if (!project.isMember(this.currentUserId)) {
        //Si non on affiche le template "accès refusé"
        this.render('accessDenied');
      } else {
        //Si oui on affiche le template
        this.render();
      }
    }
  }
});

export default isUserMember;