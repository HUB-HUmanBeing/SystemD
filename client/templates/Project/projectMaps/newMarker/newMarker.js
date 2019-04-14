import mapParams from "../../../../lib/controllers/mapParams";
import mapController from "../../../../lib/controllers/mapController";

Template.newMarker.helpers({
    //add you helpers here
    colors: function () {
        return mapParams.colors
    },
    icons: function () {
        return mapParams.shapes.icons
    },
    selectedColor: function () {
        return Template.instance().selectedColor.get()
    }
});

Template.newMarker.events({
    //add your events here
    'click [selectColor]': function (event, instance) {
        event.preventDefault()
        let color = event.currentTarget.id.split("-")[1]
        instance.selectedColor.set(color)
        console.log(instance.data.mapState.get())
        if (instance.data.mapState.get().type) {
            mapController.editMarkerCreatorColor(instance.data.mapState, color)
        }
    },
    'click [selectIcon]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopMarkerCreator(instance.data.mapState)
        }
        let icon = event.currentTarget.id.split("#")[2]
        let color = instance.selectedColor.get()
        let creationOptions = {icon: icon, color: color}
        mapController.startMarkerCreator('iconMarker', creationOptions, instance.data.mapState)
    }
});

Template.newMarker.onCreated(function () {
    this.selectedColor = new ReactiveVar(mapParams.colors[0])
});

Template.newMarker.onRendered(function () {
    //add your statement here
    $('#markerList').collapsible();
});

Template.newMarker.onDestroyed(function () {
    //add your statement here
});

