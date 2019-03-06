import projectController from "../../../../lib/controllers/projectController";
import hubCrypto from "../../../../lib/hubCrypto";

Template.deleteProject.helpers({
    //add you helpers here
    isDeletable : function () {
        return Template.currentData().currentProject.isDeletable()
    }
});

Template.deleteProject.events({
    //add your events here
    'click [deleteProject]': function (event, instance) {
        event.preventDefault()
        let currentProject = instance.data.currentProject
        let userProjectIndex = projectController.getCurrentUserProjectIndex(currentProject._id)
        if (currentProject.isDeletable()) {
            FlowRouter.go("/")
            currentProject.callMethod(
                "deleteProject",
                projectController.getAuthInfo(currentProject._id),
                userProjectIndex,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        hubCrypto.decryptAndStoreProjectListInSession()
                        window.localStorage.setItem("lastOpenedProjectId", null)
                        Materialize.toast(__("deleteProject.deleteSuccess"), 6000, "toastOk")
                    }
                })
        } else {
            Materialize.toast(__("deleteProject.deleteProjectError"), 6000, "toastError")
        }

    },
});

Template.deleteProject.onCreated(function () {
    //add your statement here
});

Template.deleteProject.onRendered(function () {
    //add your statement here
});

Template.deleteProject.onDestroyed(function () {
    //add your statement here
});

