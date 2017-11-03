import Project from '/imports/classes/Project'

Template.editProjectInfo.helpers({
    //add you helpers here
    isDeletable : function () {
        let project = Project.findOne({_id : Template.instance().data.project._id})
        return project.isDeletable()
    }
});

Template.editProjectInfo.events({
    //add your events here
    'click [deleteProject]' : function (event, instance) {
        let currentProject = Project.findOne({_id : Template.instance().data.project._id})
        currentProject.callMethod(
            'deleteProject',
            (error) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    Materialize.toast("Le projet à été définitivement supprimé", 6000, 'green')
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

