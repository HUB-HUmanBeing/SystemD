import mapController from "../../../../lib/controllers/mapController";

Template.creatingArrow.helpers({
    //add you helpers here
});

Template.creatingArrow.events({
    //add your events here
    'click [abort]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopMarkerCreator(instance.data.mapState)
            instance.data.mapState.set({})
        }
    }
});

Template.creatingArrow.onCreated(function () {
    //add your statement here
});

Template.creatingArrow.onRendered(function () {
    //add your statement here
});

Template.creatingArrow.onDestroyed(function () {
    //add your statement here
});

