import Project from "../../../../imports/classes/Project";
import mapController from "../../../lib/controllers/mapController";
import projectController from "../../../lib/controllers/projectController";

Template.projectMaps.helpers({
    //add you helpers here
    footerOpened: function () {
        return Template.instance().footerOpened.get()
    },
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    sideNav: function () {
        FlowRouter.watchPathChange()
        return ( !Template.instance().mapState.get().type) && FlowRouter.current().queryParams.side
    },
    showFullScreen: function () {
        return true
    },
    isFullScreen: function () {
        return Template.instance().isFullScreen.get()
    },
    sideNavData: function () {
        return {
            project: Project.findOne(FlowRouter.current().params.projectId),
            mapState: Template.instance().mapState
        }
    },
    mapState: function () {
        return Template.instance().mapState.get()

    }

});

Template.projectMaps.events({
    //add your events here

    "click [newMarker]": function (event, instance) {
        //event.preventDefault()
        instance.footerOpened.set(!instance.footerOpened.get())
        //return
        return true
    },
    "click [closeSideNav]": function (event) {
        event.preventDefault()
        FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/maps")
    },
    "click [fullScreen]": function (event, instance) {
        event.preventDefault()
        var elem = document.getElementById("mapContainer");
        if (elem.requestFullscreen) {
            if (document && document.exitFullscreen && (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement)) {
                document.exitFullscreen()
                instance.isFullScreen.set(false)
            } else {
                elem.requestFullscreen();
                instance.isFullScreen.set(true)
            }

        }
        return true
    },
    "click #mapContainer .btn-floating": function (event, instance) {
        if (document && document.exitFullscreen && (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement)) {
            document.exitFullscreen()
            instance.isFullScreen.set(false)
        }
        return true
    }
});

Template.projectMaps.onCreated(function () {
    //add your statement here
    this.footerOpened = new ReactiveVar(false)
    this.isFullScreen = new ReactiveVar(false)
    this.mapState = new ReactiveVar({currentAction: false})
    let projectId = FlowRouter.current().params.projectId
    Meteor.subscribe('mapMarkers', projectController.getAuthInfo(projectId), projectId)
    Meteor.setTimeout(() => {
        mapController.initialize(Project.findOne(projectId), this)

    }, 200)
});

Template.projectMaps.onRendered(function () {
    //add your statement here

});

Template.projectMaps.onDestroyed(function () {
    //add your statement here
});

