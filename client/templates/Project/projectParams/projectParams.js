import Project from "/imports/classes/Project";
import projectController from "../../../lib/controllers/projectController";

Template.projectParams.helpers({
    //add you helpers here
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    }
});

Template.projectParams.events({
    //add your events here
});

Template.projectParams.onCreated(function () {
    //add your statement here
    projectController.checkAdminOrReroute(FlowRouter.current().params.projectId)
});

Template.projectParams.onRendered(function () {
    //add your statement here
    Meteor.setTimeout(()=>{
        $('#editProjectCollapse').collapsible();
    },500)
});

Template.projectParams.onDestroyed(function () {
    //add your statement here
});

