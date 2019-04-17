import mapController from "../../../../lib/controllers/mapController";

Template.editingIcon.helpers({
    //add you helpers here
});

Template.editingIcon.events({
    //add your events here
    'click [abort]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopEtitingMarker(instance.data.mapState)
            instance.data.mapState.set({})
        }
    }
});

Template.editingIcon.onCreated(function () {
    //add your statement here

});

Template.editingIcon.onRendered(function () {
    //add your statement here

});

Template.editingIcon.onDestroyed(function () {
    //add your statement here
});

