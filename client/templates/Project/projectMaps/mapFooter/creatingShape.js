import shape from "../../../../lib/controllers/markers/shape";

Template.creatingShape.helpers({
    //add you helpers here
    options: function () {
        return Template.currentData().mapState.get().options
    },
    text: function () {
        return __("creatingShape." + Template.currentData().mapState.get().options.shapeType + "Info")
    }
});

Template.creatingShape.events({
    //add your events here
    'click [save]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            shape.save(instance.data.mapState)
        }

    },
    'click [undo]': function (event, instance) {
        event.preventDefault()
        shape.undo()
    },
    'click [abort]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            shape.stop(instance.data.mapState)
        }
    },
});

Template.creatingShape.onCreated(function () {
    //add your statement here

});

Template.creatingShape.onRendered(function () {
    //add your statement here
});

Template.creatingShape.onDestroyed(function () {
    //add your statement here
});

