import projectController from "../../../../lib/controllers/projectController";

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

