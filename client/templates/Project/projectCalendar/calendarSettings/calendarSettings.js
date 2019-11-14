import projectController from "../../../../lib/controllers/projectController";
import MapMarker from "../../../../../imports/classes/MapMarker";
import Activity from "../../../../../imports/classes/Activity";

Template.calendarSettings.helpers({
    //add you helpers here
    colorLegendCallback: function () {
        let instance=Template.instance()
        return function (encryptedColorLegends) {
            instance.data.project.callMethod("editCalendarLegend",
                projectController.getAuthInfo(instance.data.project._id),
                encryptedColorLegends,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                    }
                })
        }
    },
    durationOptions: function () {
        return [
            {
                value: 1,
                label: "1 " + __("newInvitation.day")
            },
            {
                value: 7,
                label: "1 " + __("newInvitation.week")
            },
            {
                value: 30,
                label: "1 " + __("newInvitation.month")
            },
            {
                value: 183,
                label: "6 " + __("newInvitation.month")
            },
        ]
    },
});

Template.calendarSettings.events({
    //add your events here
    'click [selectDefaultView]': function (event, instance) {
        event.preventDefault()
        let view = event.currentTarget.id.split('#')[1]
        instance.data.project.callMethod("editCalendarDefaultView",
            projectController.getAuthInfo(instance.data.project._id),
            view,
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    Materialize.toast(__('calendarSettings.defaultViewSaved'), 6000, 'toastOk')
                }
            })
    },
    'click [deleteOldActivities]': function (event, instance) {
        event.preventDefault()
        let duration = Number($("#duration").val())
        let ActivityInstance = new Activity()
        let projectId = FlowRouter.current().params.projectId
        if (duration) {
            let date = new Date()
            date.setDate(date.getDate() - duration)
            console.log(date)
            ActivityInstance.callMethod("deleteOldsActivities", projectController.getAuthInfo(projectId), projectId, date, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    Materialize.toast(__('calendarSettings.oldsActivitiesDeleted'), 6000, 'toastOk')
                }
            })
        }

    }
});

Template.calendarSettings.onCreated(function () {
    //add your statement here
});

Template.calendarSettings.onRendered(function () {
    //add your statement here
    resetTooltips()
    $('#duration').material_select();
});

Template.calendarSettings.onDestroyed(function () {
    //add your statement here
    $('#duration').material_select('destroy');
});

