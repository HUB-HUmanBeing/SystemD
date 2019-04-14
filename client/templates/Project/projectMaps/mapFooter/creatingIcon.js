import mapController from "../../../../lib/controllers/mapController";

Template.creatingIcon.helpers({
    //add you helpers here
});

Template.creatingIcon.events({
    //add your events here
    'click [abort]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopMarkerCreator(instance.data.mapState.get())
            instance.data.mapState.set({})
        }
    }
});

Template.creatingIcon.onCreated(function () {
    //add your statement here
});

Template.creatingIcon.onRendered(function () {
    //add your statement here
});

Template.creatingIcon.onDestroyed(function () {
    //add your statement here
});

