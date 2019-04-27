import projectController from "../../../lib/controllers/projectController";
import mapController from "../../../lib/controllers/mapController";
import Project from "../../../../imports/classes/Project";
import calendarController from "../../../lib/controllers/calendarController";

Template.projectCalendar.helpers({
    //add you helpers here
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    sideNav: function () {
        FlowRouter.watchPathChange()
        return FlowRouter.current().queryParams.side
    },
    sideNavData: function () {
        return {
            project: Project.findOne(FlowRouter.current().params.projectId),
            calendarState: Template.instance().calendarState
        }
    },
    calendarState: function () {
        return Template.instance().calendarState.get()

    }
});

Template.projectCalendar.events({
    //add your events here
    "click [closeSideNav]": function (event) {
        event.preventDefault()
        FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/calendar")
    },
});

Template.projectCalendar.onCreated(function () {
    //add your statement here
    this.calendarState = new ReactiveVar({currentAction: false})
        let projectId = FlowRouter.current().params.projectId
        Meteor.subscribe('calendarEventsProject', projectController.getAuthInfo(projectId), projectId)
        Meteor.setTimeout(() => {
            calendarController.initialize(Project.findOne(projectId), this)

        }, 200)
});

Template.projectCalendar.onRendered(function () {
    //add your statement here

});

Template.projectCalendar.onDestroyed(function () {
    //add your statement here
});

