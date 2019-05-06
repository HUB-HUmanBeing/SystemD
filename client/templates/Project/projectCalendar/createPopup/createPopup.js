import mapParams from "../../../../lib/controllers/mapParams";

Template.createPopup.helpers({
    //add you helpers here
    selectedColor: function () {
        return Template.instance().selectedColor.get()
    },
    colors: function () {
        return mapParams.colors
    },
});

Template.createPopup.events({
    //add your events here
    'click [selectColor]': function (event, instance) {
        event.preventDefault()
        let color = Number(event.currentTarget.id.split("-")[1])
        instance.selectedColor.set(color)
    },
    'click [abort]': function (event, instance) {
        event.preventDefault()
        instance.data.parentInstance.createParams.set(false)
    }
    ,
    'click [create]': function (event, instance) {
            // activity.callMethod("newCalendarActivity", projectController.getAuthInfo(project._id), project._id, activityParams, {}, (err, res) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         this.calendar.unselect()
            //         this.getEventDetail(res)
            //     }
            // })
        }
});

Template.createPopup.onCreated(function () {
    //add your statement here
    this.selectedColor = new ReactiveVar(0)
});

Template.createPopup.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.createPopup.onDestroyed(function () {
    //add your statement here
});

