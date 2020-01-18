import projectController from "../../../lib/controllers/projectController";
import mapController from "../../../lib/controllers/mapController";
import Project from "../../../../imports/classes/Project";
import calendarController from "../../../lib/controllers/calendarController";
import cryptoTools from "../../../lib/cryptoTools";

Template.projectCalendar.helpers({
    //add you helpers here
    currentProject: function () {
        FlowRouter.watchPathChange()
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    sideNav: function () {
        FlowRouter.watchPathChange()
        if(Meteor.Device.isDesktop()){
            return FlowRouter.current().queryParams.side?FlowRouter.current().queryParams.side : "calendarSettings"
        }else{
            return FlowRouter.current().queryParams.side
        }

    },
    sideNavData: function () {
        return {
            project: Project.findOne(FlowRouter.current().params.projectId),
            calendarState: Template.instance().calendarState,
            colorLegend:Template.instance().colorLegend.get()
        }
    },
    calendarState: function () {
        return Template.instance().calendarState.get()

    },
    title: function () {
        return Template.instance().title.get()
    },
    currentView: function () {
        FlowRouter.watchPathChange()
        let view = FlowRouter.current().queryParams.view
        let name=view?view: Project.findOne(FlowRouter.current().params.projectId).private.calendar.defaultView
        let icon=""
        switch (name) {
            case "days":
                icon="view_list"
                break
            case "month":
                icon="view_comfy"
                break
            case "listMonth":
                icon="format_list_bulleted"
                break
            default:
                break

        }
        return {name:name,icon:icon}
    },
    colorLegend:function () {
        return Template.instance().colorLegend.get()
    },
    createParams: function () {
        return Template.instance().createParams.get()
    },
    parentInstance: function () {
        return Template.instance()
    },
    waitingActivity: function () {
        return Session.get("waitingActivity")
    },
    showSettingsBtn: function () {
        FlowRouter.watchPathChange()

        return (!Meteor.Device.isDesktop() || FlowRouter.current().queryParams.activityId )
    }
});

Template.projectCalendar.events({
    //add your events here
    "click [closeSideNav]": function (event) {
        event.preventDefault()
        calendarController.closeSideNav()
    },
    'click [dayView]': function (event) {
        event.preventDefault()
        $('.calendarButtons').closeFAB()
        resetTooltips()
        calendarController.changeView('days')
    },
    'click [monthView]': function (event) {
        event.preventDefault()
        $('.calendarButtons').closeFAB()
        resetTooltips()
        calendarController.changeView('month')
    },
    'click [listView]': function (event) {
        event.preventDefault()
        resetTooltips()
        calendarController.changeView('listMonth')
        $('.calendarButtons').closeFAB()
    },
    'click [previousPeriod]': function (event) {
        event.preventDefault()
        calendarController.changePeriod(true)
    },
    'click [nextPeriod]': function (event) {
        event.preventDefault()
        calendarController.changePeriod(false)
    },
    'click [goSettings]': function (event) {
        event.preventDefault()
        resetTooltips()
        calendarController.goSettings()
    },
    'click [stopWaitingActivity]':function (event) {
        event.preventDefault()
        let activity = Session.get("waitingActivity")
        FlowRouter.go('/project/'+activity.projectId+'/tasks')
        Session.set("waitingActivity", false)
    },
    'click [addEvent]': function (event) {
        event.preventDefault()
        Session.set("addEvent",true)
        Materialize.toast(__('projectCalendar.setActivityInfo'), 5000, 'toastOk')
    }
});

Template.projectCalendar.onCreated(function () {
    //add your statement here
    this.colorLegend = new ReactiveVar([])
    this.title = new ReactiveVar("")
    this.calendarState = new ReactiveVar({currentAction: false})
    this.createParams =  new ReactiveVar(false)
    let projectId = FlowRouter.current().params.projectId
    Meteor.subscribe('calendarEventsProject', projectController.getAuthInfo(projectId), projectId)
    Meteor.setTimeout(() => {
        calendarController.initialize(Project.findOne(projectId), this)

    }, 200)

    this.autorun(()=>{
        FlowRouter.watchPathChange()
        let colorLegends = Project.findOne(FlowRouter.current().params.projectId).private.calendar.symEncArr_colorLegend
        cryptoTools.decryptStringArray(colorLegends,Session.get("currentProjectSimKey"), decryptedCalendarlegend=>{
            this.colorLegend.set(decryptedCalendarlegend)
        })
    })
});

Template.projectCalendar.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.projectCalendar.onDestroyed(function () {
    //add your statement here
   Session.set("waitingActivity", false)
   Session.set("addEvent",false)
});

