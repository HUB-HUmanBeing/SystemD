import projectController from "../../../../../../../lib/controllers/projectController";

Template.pinned.helpers({
    //add you helpers here
    pinned: function () {
        let pinned = Template.currentData().class.pinned
       return pinned
    }
});

Template.pinned.events({
    //add your events here
    'click [togglePinned]': function (event, instance) {
        event.preventDefault()
        instance.data.class.callMethod("togglePinned",
            projectController.getAuthInfo(FlowRouter.current().params.projectId), (err) => {
                if (err) {
                    console.log(err)
                }
            }
        )

    }
});

Template.pinned.onCreated(function () {
    //add your statement here
});

Template.pinned.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.pinned.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

