import mapController from "../../../../lib/controllers/mapController";
import polyline from "../../../../lib/controllers/markers/polyline";

Template.creatingPolyline.helpers({
    //add you helpers here
});

Template.creatingPolyline.events({
    //add your events here
    'click [save]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            polyline.save(instance.data.mapState)
        }

    },
    'click [undo]': function (event, instance) {
        event.preventDefault()
        polyline.undo()
    },
    'click [abort]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            polyline.stop(instance.data.mapState)
        }
    },

});

Template.creatingPolyline.onCreated(function () {
    //add your statement here
});

Template.creatingPolyline.onRendered(function () {
    //add your statement here
});

Template.creatingPolyline.onDestroyed(function () {
    //add your statement here
});

