import Project from "../../../../../imports/classes/Project";

Template.sideNav.helpers({
    sideNavData: function () {
        return {
            project: Project.findOne(FlowRouter.current().params.projectId),
            colorLegend: Template.instance().colorLegend.get(),
            chatOpened: Template.instance().chatOpened.get()
        }
    },
    chatOpened: function () {
        return Template.instance().chatOpened.get()
    },
    deviceType: function () {
        if ( Meteor.Device.isDesktop() ){
            return "desktopSideNav" 
        } else if ( Meteor.Device.isMobile() ){
            return "mobileSideNav"
        } else { 
            return "tabletSideNav" 
        }
    },
    where: function () {
        return FlowRouter.current().route.name 
    }
});

Template.sideNav.events({
    'click [toggleChat]': function (event, instance) {
        event.preventDefault()
        instance.chatOpened.set(!instance.chatOpened.get())
    }
});

Template.sideNav.onCreated(function () {
    this.colorLegend = new ReactiveVar([])
    this.chatOpened = new ReactiveVar(false)
})


Template.sideNav.onRendered(function () {
});

Template.sideNav.onDestroyed(function () {
});

