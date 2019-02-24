import Project from "../../../../imports/classes/Project";

Template.projectHome.helpers({
    //add you helpers here
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    descriptionVisible : function () {
        return Template.instance().descriptionVisible.get()
    }
});

Template.projectHome.events({
    //add your events here
    "click [toggleDescription]" : function (event, instance) {
        instance.descriptionVisible.set(!instance.descriptionVisible.get())
    }
});

Template.projectHome.onCreated(function () {
    //add your statement here
    this.descriptionVisible = new ReactiveVar(false)
});

Template.projectHome.onRendered(function () {
    //add your statement here
});

Template.projectHome.onDestroyed(function () {
    //add your statement here
});

