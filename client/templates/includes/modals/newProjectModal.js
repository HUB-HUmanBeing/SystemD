import Project from "/imports/classes/Project";

Template.newProjectModal.helpers({
    //add you helpers here
    disabled: function () {
        return Template.instance().disabled.get()
    },
    errorMessage: function () {
        return Template.instance().errorMessage.get()
    }
});

Template.newProjectModal.events({
    'keyup input': function (event, instance) {
        let projectName = event.target.value
        if (projectName.length >= 5) {
            instance.lastKeyUpTime.set(event.timeStamp);
            Meteor.setTimeout(function () {
                if (instance.lastKeyUpTime.get() === event.timeStamp) {
                    Meteor.call('isProjectExists', projectName, function (error, result) {

                        if (result) {
                            instance.errorMessage.set("")
                            instance.disabled.set("")
                        } else {
                            instance.errorMessage.set('Le projet "' + projectName + '" existe déja');
                            instance.disabled.set("disabled")
                        }
                    })
                }
            }, 350)
        }
    },
    //add your events here
    'submit [newProjectForm]': function (event, instance) {
        event.preventDefault();
        if (instance.disabled.get() === "") {
            let projectName = $('#new-project-name').val();
            let newProject = new Project();
            newProject.callMethod('createProject',
                projectName,
                function (error, result) {
                    console.log(error)
                    if (error) {
                        Materialize.toast(error.message, 6000, "red")
                    } else {
                        Materialize.toast('Le Projet " ' + projectName + ' "à bien été créé', 6000, "green")
                        $('.new-project-modal').modal('close');
                        Router.go('projectMainPage' , { _id : result})
                    }
                })
        }
    }
});

Template.newProjectModal.onCreated(function () {
    //add your statement here
    this.disabled = new ReactiveVar("disabled")
    //chek de la derniere touche pressée pour eviter la surcharge de requetes
    this.lastKeyUpTime = new ReactiveVar()
    this.errorMessage = new ReactiveVar("")
});

Template.newProjectModal.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});

});

Template.newProjectModal.onDestroyed(function () {
    //add your statement here
});

