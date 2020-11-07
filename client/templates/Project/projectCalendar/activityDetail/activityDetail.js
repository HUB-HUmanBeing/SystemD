import cryptoTools from "../../../../lib/cryptoTools";
import projectController from "../../../../lib/controllers/projectController";
import Activity from "../../../../../imports/classes/Activity";
import mapParams from "../../../../lib/controllers/mapParams";
import calendarController from "../../../../lib/controllers/calendarController";
import notificationController from "../../../../lib/controllers/notificationController";
import mapController from "../../../../lib/controllers/mapController";
import iconMarker from "../../../../lib/controllers/markers/iconMarker";
import activityMarker from "../../../../lib/controllers/markers/activityMarker";
import preFormatMessage from "../../../../lib/preformatMessages";
import moment from "../../../../lib/i18nMoment";

Template.activityDetail.helpers({
    //add you helpers here
    icon: function () {
        let activity = Template.instance().activity.get()
        if (activity.start) {
            if (activity.start.getTime() > Date.now()) {
                return "event"
            } else {
                return "hourglass_empty"
            }
        } else {
            if (activity.done) {
                return "check_box"
            } else {
                return "check_box_outline_blank"
            }
        }
    },
    initialColor: function () {
        return Template.instance().initialColor.get()
    },
    showDates: function () {
        FlowRouter.watchPathChange()
        return (FlowRouter.current().route.name !== "project-calendar") && Template.instance().activity.get().start
    },
    activity: function () {
        let activity = Template.instance().activity.get()
        Meteor.setTimeout(() => {
            if (activity) {
                $('#editActivityDetail').val(activity.symEnc_detail);
                $('#editActivityDetail').trigger('autoresize');
                Materialize.updateTextFields();
            }
        }, 100)
        return activity
    },
    showEditFormButton: function () {
        return Template.instance().showEditFormButton.get()
    },
    editingColor: function () {
        return Template.instance().editingColor.get()
    },
    editingTextareaDetail: function () {
        return Template.instance().editingTextareaDetail.get()
    },
    colors: function () {
        return mapParams.colors
    },
    eventColor: function () {

        return mapParams.colors[Template.instance().activity.get().color]
    },
    weekdays: function () {
        let weekDays = []
        for (let i = 0; i < 7; i++) {
            weekDays.push({
                day: (__("weekDays.day" + i)).substr(0, 2),
                checked: Template.instance().activity.get().daysOfWeek.indexOf(i) !== -1
            })
        }
        return weekDays
    },
    modalOpened: function () {
        return Template.instance().modalOpened.get()
    },
    isDeletable: function () {
        return Template.instance().activity.get().createdBy === projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId || projectController.isAdmin(FlowRouter.current().params.projectId)
    },
    invitableMembers: function () {
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        if(typeof activity !== "undefined"){
            let participants = activity.participants
            let projectId = FlowRouter.current().params.projectId
            let invitable = []
            let blackList = [...participants, projectController.getCurrentMemberId(projectId)]
            Session.get("currentProjectMembers").forEach(member => {
                if (blackList.indexOf(member.memberId) === -1)
                    invitable.push(member)
            })

            return invitable
        }
    },
    editInvitedMembers: function () {
        let instance = Template.instance()

        let activityId = FlowRouter.current().queryParams.activityId
        let projectId = FlowRouter.current().params.projectId
        let activity = Activity.findOne(activityId)
        let previousMembers = activity.invitedMembers
        return (selectedMembers) => {

            let addedMembers = []
            let removedMembers = []
            selectedMembers.forEach(selectedMember => {
                if (previousMembers.indexOf(selectedMember) === -1) {

                    addedMembers.push(selectedMember)
                }
            })
            previousMembers.forEach(previousMember => {
                if (selectedMembers.indexOf(previousMember) === -1) {
                    removedMembers.push(previousMember)
                }
            })
            activity.callMethod(
                "editInvited",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                addedMembers,
                removedMembers,
                notificationController.getNotifyObjects(addedMembers), err => {
                    if (err) {
                        console.log(err)
                    } else {
                        instance.modalOpened.set(false)
                        resetTooltips()
                    }
                })
        }
    },
    coordinates: function () {

        let activity = Template.instance().activity.get()
        let coordinatesArray = JSON.parse(activity.symEnc_coordinates)
        return coordinatesArray[0] + " , " + coordinatesArray[1]
    },
    showGoto: function () {
        return FlowRouter.current().route.name === "project-maps"
    },
    duration: function (){
        let activity = Template.instance().activity.get()
if(activity.end){
    let start = moment(activity.start); // some random moment in time (in ms)
    let end = moment(activity.end); // some random moment after start (in ms)
    let diff = end.diff(start);
// execution
    return moment.utc(diff).format("HH : mm" );
}else{
    return "00:30"
}

    }
});

Template.activityDetail.events({
    //add your events here
    //add your events here
    'keyup #EditActivityForm': function (event, instance) {
        instance.showEditFormButton.set(true)
        return true
    },
    'submit [editActivity] ': function (event, instance) {
        event.preventDefault()
        let params = {
            symEnc_title: $('#activityTitle').val(),
            symEnc_detail: $('#editActivityDetail').val()? preFormatMessage($('#editActivityDetail').val()) : ""
        }
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        cryptoTools.encryptObject(params, {symKey: Session.get("currentProjectSimKey")}, encryptedParams => {
            activity.callMethod(
                "editActivityTexts",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                encryptedParams,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        instance.showEditFormButton.set(false)
                        instance.editingTextareaDetail.set(false)
                    }
                })
        })
    },
    'click [deleteActivity]': function (event, instance) {
        event.preventDefault()
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        activity.callMethod(
            "delete",
            projectController.getAuthInfo(activity.projectId),
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    calendarController.closeSideNav()
                }
            })
    },
    'click [editColor]': function (event, instance) {
        event.preventDefault()
        resetTooltips()
        instance.editingColor.set(!instance.editingColor.get())
    },
    'click [textareaDetail]': function (event, instance) {
        event.preventDefault()
        instance.editingTextareaDetail.set(true)
    },
    'click [selectColor]': function (event, instance) {
        event.preventDefault()
        let color = Number(event.currentTarget.id.split("-")[1])
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        activity.callMethod("changeColor", projectController.getAuthInfo(FlowRouter.current().params.projectId), color, err => {
            if (err) {
                console.log(err)
            } else {
                instance.editingColor.set(false)
                resetTooltips()
            }
        })


    },
    'change [recursivitySwitch]': function (event, instance) {

        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        let recursivity
        if (activity.daysOfWeek.length == 0) {

            recursivity = [activity.start.getDay()]
        } else {
            recursivity = []
        }
        activity.callMethod("changeRecursivity", projectController.getAuthInfo(FlowRouter.current().params.projectId), recursivity, err => {
            if (err) {
                console.log(err)
            } else {

                resetTooltips()
            }
        })


    },
    'change [mapSwitch]': function (event, instance) {

        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        if (activity.symEnc_coordinates) {
            event.preventDefault()
            activity.callMethod("editActivityPosition", projectController.getAuthInfo(FlowRouter.current().params.projectId), "", err => {
                if (err) {
                    console.log(err)
                } else {
                    if (FlowRouter.current().route.name === "project-maps") {
                        FlowRouter.go("/project/" + activity.projectId + "/maps")
                    }
                }
            })
        } else {
            Session.set("activityToPositionate", {activity: activity, from: FlowRouter.current().route.name})
            FlowRouter.go("/project/" + activity.projectId + "/maps")
        }
    },
    'change [agendaSwitch]': function (event, instance) {

        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        if (activity.start) {
            Session.set("draggedTaskItem", null)
            activity.callMethod(
                "changeList",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                "todo",
                (err, res) => {
                    if (err) {

                        console.log(err)
                    }else{
                        if((FlowRouter.current().route.name === "project-calendar")){
                            FlowRouter.go('/project/' + activity.projectId + "/calendar")
                        }
                    }
                }
            )
        } else {
            Session.set("waitingActivity", activity)
            FlowRouter.go('/project/' + activity.projectId + "/calendar")
            Materialize.toast(__('projectCalendar.setActivityInfo'), 6000, 'toastOk')
        }
    },
    'click [moveMarker]': function (event, instance) {
        Session.set("activityToPositionate", {activity: instance.activity.get(), from: FlowRouter.current().route.name})
        FlowRouter.go("/project/" + instance.activity.get().projectId + "/maps")

    },
    'click [goTo]': function (event, instance) {

        navigator.geolocation.getCurrentPosition(function (location) {
            let userPosition = [location.coords.latitude, location.coords.longitude]
            let pointToGo = JSON.parse(instance.activity.get().symEnc_coordinates)
            let url = "https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=" + userPosition[0] + "%2C" + userPosition[1] + "%3B" + pointToGo[0] + "%2C" + pointToGo[1]
            var win = window.open(url, '_blank');
            win.focus();
        })
    },
    'click [toogleDay]': function (event, instance) {

        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        let recursivity = activity.daysOfWeek
        let clickedDay = Number(event.currentTarget.id.split('-')[1])
        let index = activity.daysOfWeek.indexOf(clickedDay)
        if (index != -1) {
            recursivity.splice(index, 1)
        } else {
            recursivity.push(clickedDay)
        }
        activity.callMethod("changeRecursivity", projectController.getAuthInfo(FlowRouter.current().params.projectId), recursivity, err => {
            if (err) {
                console.log(err)
            } else {
                //instance.editingColor.set(false)
                resetTooltips()
            }
        })
    },
    'click [togglePresence]': function (event, instance) {
        event.preventDefault()
        resetTooltips()
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        activity.callMethod("togglePresence", projectController.getAuthInfo(FlowRouter.current().params.projectId), err => {
            if (err) {
                console.log(err)
            } else {
                Meteor.setTimeout(()=>{
                    resetTooltips()
                },200)

            }
        })
    },
    'click [toggleModalInviteMembers]': function (event, instance) {
        event.preventDefault()
        instance.modalOpened.set(!instance.modalOpened.get())
    }
});

Template.activityDetail.onCreated(function () {
    //add your statement here
    //add your statement here
    this.activity = new ReactiveVar(false)
    this.showEditFormButton = new ReactiveVar(false)
    this.editingColor = new ReactiveVar(false)
    this.editingTextareaDetail = new ReactiveVar(false)
    this.modalOpened = new ReactiveVar(false)
    this.initialColor = new ReactiveVar(false)
    this.autorun(() => {
        FlowRouter.watchPathChange()
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        if (activity) {
            if (!activity.lastEditAt) {
                this.initialColor.set(true)
            }
            cryptoTools.decryptObject(activity, {symKey: Session.get("currentProjectSimKey")}, decryptedObject => {
                this.activity.set(decryptedObject)
                if (decryptedObject.symEnc_coordinates &&(FlowRouter.current().route.name === "project-maps")) {
                    Meteor.setTimeout(() => {
                        activityMarker.startHighlightMapIcon(decryptedObject)
                    },500)
                }
                this.editingTextareaDetail.set(false)
                if (!decryptedObject.symEnc_title) {
                    Meteor.setTimeout(() => {
                        $('#activityTitle').focus()
                    }, 500)

                }
            })
        }
    })

})


Template.activityDetail.onRendered(function () {
    //add your statement here
    resetTooltips()
    this.editingTextareaDetail.set(false)
});

Template.activityDetail.onDestroyed(function () {
    //add your statement here
    if((FlowRouter.current().route.name === "project-maps")){
        activityMarker.stopHighlightMapIcon(this.activity.get()._id)
    }
    resetTooltips()
});

