import projectController from "../../../../lib/controllers/projectController";

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
    }
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
    }
});

Template.calendarSettings.onCreated(function () {
    //add your statement here
    console.log(this.data.project)
});

Template.calendarSettings.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.calendarSettings.onDestroyed(function () {
    //add your statement here
});

