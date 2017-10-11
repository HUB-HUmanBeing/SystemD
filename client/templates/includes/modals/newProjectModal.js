import Project from "/imports/classes/Project";

Template.newProjectModal.helpers({
    //add you helpers here
});

Template.newProjectModal.events({
    //add your events here
    'submit [newProjectForm]': function (event, instance) {
        event.preventDefault();
        let projectName = $('#new-project-name').val();
        let newProject = new Project();
        newProject.callMethod('createProject',
            projectName,
            function (error, result) {
            console.log(error)
                if (error) {
                    Materialize.toast(error.message, 6000, "red")
                } else {
                    Materialize.toast("Le Projet " + projectName + "à bien été créé", 6000, "green")
                }
            })
    }
});

Template.newProjectModal.onCreated(function () {
    //add your statement here
});

Template.newProjectModal.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});

});

Template.newProjectModal.onDestroyed(function () {
    //add your statement here
});

