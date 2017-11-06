import Project from '/imports/classes/Project'

Template.editProjectInfo.helpers({
    //add you helpers here
    isDeletable : function () {
        let project = Project.findOne({_id : Template.instance().data.project._id})
        return project.isDeletable()
    }
});

Template.editProjectInfo.events({
    //aaction de suppression definitive d'un projet
    'click [deleteProject]': function () {
        //on récupere le projet courant
        let currentProject = Project.findOne({_id: Template.instance().data.project._id})
        //on appele la methode de suppression
        currentProject.callMethod(
            'deleteProject',
            (error) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    //sinon, on toast le succes,
                    Materialize.toast("Le projet à été définitivement supprimé", 6000, 'green')
                    //on ferme la modal
                    $('.modal').modal('close');
                    //on redirige vers la page des projets utilisateurs
                    Router.go('userSelfProjects')
                }
            })
    }
});

Template.editProjectInfo.onCreated(function () {

});

Template.editProjectInfo.onRendered(function () {
    //add your statement here
    $('.modal').modal();
   $('.collapsible').collapsible();
});

Template.editProjectInfo.onDestroyed(function () {
    //add your statement here
});

