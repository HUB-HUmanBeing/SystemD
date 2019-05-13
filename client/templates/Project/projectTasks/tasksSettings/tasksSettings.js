import projectController from "../../../../lib/controllers/projectController";
import Activity from "../../../../../imports/classes/Activity";

Template.tasksSettings.helpers({
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
        ]
    },
});

Template.tasksSettings.events({
    //add your events here
    'click [deleteOldActivities]': function (event, instance) {
        event.preventDefault()
        let activityInstance = new Activity()
        let projectId= FlowRouter.current().params.projectId
        activityInstance.callMethod("deleteDone", projectController.getAuthInfo(projectId), projectId,(err) => {
            if (err) {
                console.log(err)
            } else {
                Materialize.toast(__('tasksSettings.doneActivitiesDeleted'), 6000, 'toastOk')
            }
        })
    }
});

Template.tasksSettings.onCreated(function () {
    //add your statement here
});

Template.tasksSettings.onRendered(function () {
    //add your statement here
    resetTooltips()
    $('#duration').material_select();
});

Template.tasksSettings.onDestroyed(function () {
    //add your statement here
    $('#duration').material_select('destroy');
});

