import Project from "/imports/classes/Project";

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
});

Template.projectParams.onRendered(function () {
    //add your statement here
});

Template.projectParams.onDestroyed(function () {
    //add your statement here
});

