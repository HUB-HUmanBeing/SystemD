import mapParams from "../../../../lib/controllers/mapParams";
import Activity from "../../../../../imports/classes/Activity";
import projectController from "../../../../lib/controllers/projectController";
import calendarController from "../../../../lib/controllers/calendarController";

Template.invitedPopup.helpers({
    //add you helpers here
    activity: function () {
        return Session.get("invitationActivityId")
    }, eventColor: function () {

        return mapParams.colors[Session.get("invitationActivityId").color]
    },
});

Template.invitedPopup.events({
    //add your events here
    'click [accept]':function (event, instance) {
        event.preventDefault()
        let activity = Activity.findOne(Session.get("invitationActivityId")._id)
        Session.set("invitationActivityId", false)
        activity.callMethod("togglePresence", projectController.getAuthInfo(FlowRouter.current().params.projectId), err => {
            if (err) {
                console.log(err)
            } else {
                calendarController.getEventDetail(activity._id)
            }
        })
    },
    'click [decline]':function (event, instance) {
        event.preventDefault()
        let activity = Activity.findOne(Session.get("invitationActivityId")._id)
        Session.set("invitationActivityId", false)
        activity.callMethod("declineInvitation", projectController.getAuthInfo(FlowRouter.current().params.projectId), err => {
            if (err) {
                console.log(err)
            } else {
                calendarController.getEventDetail(activity._id)
            }
        })
    }
});

Template.invitedPopup.onCreated(function () {
    //add your statement here
});

Template.invitedPopup.onRendered(function () {
    //add your statement here
});

Template.invitedPopup.onDestroyed(function () {
    //add your statement here
});

