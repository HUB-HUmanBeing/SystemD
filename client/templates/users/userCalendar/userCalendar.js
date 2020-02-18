import Project from "../../../../imports/classes/Project";
import userCalendarController from "../../../lib/controllers/userCalendarController";
import cryptoTools from "../../../lib/cryptoTools";
import projectAvatarStore from "../../../lib/filesStore/projectAvatarStore";


Template.userCalendar.helpers({
    //add you helpers here
    currentProject: function () {
        FlowRouter.watchPathChange()
        return Project.findOne(FlowRouter.current().params.projectId)
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
        let name=view?view:"month"
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
    showSettingsBtn: function () {
        FlowRouter.watchPathChange()
        return ( !Meteor.Device.isDesktop() || FlowRouter.current().queryParams.activityId )
    }
});

Template.userCalendar.events({
    //add your events here
    "click [closeSideNav]": function (event) {
        event.preventDefault()
        userCalendarController.closeSideNav()
    },
    'click [dayView]': function (event) {
        event.preventDefault()
        $('.calendarButtons').closeFAB()
        resetTooltips()
        userCalendarController.changeView('days')
    },
    'click [monthView]': function (event) {
        event.preventDefault()
        $('.calendarButtons').closeFAB()
        resetTooltips()
        userCalendarController.changeView('month')
    },
    'click [listView]': function (event) {
        event.preventDefault()
        resetTooltips()
        userCalendarController.changeView('listMonth')
        $('.calendarButtons').closeFAB()
    },
    'click [previousPeriod]': function (event) {
        event.preventDefault()
        userCalendarController.changePeriod(true)
    },
    'click [nextPeriod]': function (event) {
        event.preventDefault()
        userCalendarController.changePeriod(false)
    },
    'click [goSettings]': function (event) {
        event.preventDefault()
        resetTooltips()
        userCalendarController.goSettings()
    }
/*     'click [addEvent]': function (event) {
        event.preventDefault()
        Session.set("addEvent",true)
        Materialize.toast(__('projectCalendar.setActivityInfo'), 5000, 'toastOk')
    } */
});

Template.userCalendar.onCreated(function () {
    //add your statement here
    this.colorLegend = new ReactiveVar([])
    this.title = new ReactiveVar("")
    this.calendarState = new ReactiveVar({currentAction: false})
    this.createParams =  new ReactiveVar(false)

    // Begin work
    this.projects= Session.get("projects")

    Meteor.setTimeout(() => {
        userCalendarController.initialize(this)

        this.projects.forEach((project) => {
            let projectId = project.asymEnc_projectId
    
            Meteor.subscribe('ProjectForMembers', projectId, cryptoTools.hash(project.asymEnc_projectSymKey), () => {
                let currentProject = Project.findOne(projectId)
            
                userCalendarController.initializeRouterView(this, currentProject)
                userCalendarController.initializeEventRenderer(this, currentProject)
            
                Meteor.setTimeout(() => {
                    console.log($('.EEybfMFXaDQs7krf7').attr("style"))
                    let image = projectAvatarStore.getProjectAvatar(projectId)
                    console.log(image)
                    $('.EEybfMFXaDQs7krf7').attr("style", "border-image: 'url("+image+") 10 10 10'")
                }, 2000);
            })
        })
    }, 500);
    // End Work


/* 
    this.autorun(()=>{
        FlowRouter.watchPathChange()
        let colorLegends = Project.findOne(FlowRouter.current().params.projectId).private.calendar.symEncArr_colorLegend
        cryptoTools.decryptStringArray(colorLegends,Session.get("currentProjectSimKey"), decryptedCalendarlegend=>{
            this.colorLegend.set(decryptedCalendarlegend)
        })
    }) */
});

Template.userCalendar.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.userCalendar.onDestroyed(function () {
    //add your statement here
   Session.set("waitingActivity", false)
   Session.set("addEvent",false)
});

