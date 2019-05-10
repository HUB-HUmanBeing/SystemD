import mapParams from "../../../../lib/controllers/mapParams";
import mapController from "../../../../lib/controllers/mapController";
import memberPosition from "../../../../lib/controllers/markers/memberPosition";

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
    },
    showMarkerTextSubmit: function () {

        return Template.instance().showMarkerTextSubmit.get()
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
    },
    'click [updtateUserPosition]': function (event, instance) {
        event.preventDefault()
        memberPosition.editUserPosition(instance.data.mapState)
    },
    'click [newPolyline]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopMarkerCreator(instance.data.mapState)
        }
        let color = instance.selectedColor.get()
        let creationOptions = {color: color}
        mapController.startMarkerCreator('polyline', creationOptions, instance.data.mapState)
    },
    'click [newShape]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopMarkerCreator(instance.data.mapState)
        }
        let color = instance.selectedColor.get()
        let shapeType = event.currentTarget.id.split("#")[2]
        let creationOptions = {color: color, shapeType: shapeType}
        mapController.startMarkerCreator('shape', creationOptions, instance.data.mapState)
    },
    'click [newArrow]': function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopMarkerCreator(instance.data.mapState)
        }
        let color = instance.selectedColor.get()
        let curve = event.currentTarget.id.split("#")[2]
        let curveNumber = 0
        if(curve=== "left"){
            curveNumber=0.85
        }else if(curve=="right"){
            curveNumber=-0.85
        }
        let creationOptions = {color: color, curve: curveNumber}
        mapController.startMarkerCreator('arrow', creationOptions, instance.data.mapState)
    },
    "keyup #markerText":function (event, instance) {
        instance.showMarkerTextSubmit.set(!!$('#markerText').val())
    },
    'submit [newTextZone]':function (event, instance) {
        event.preventDefault()
        if (instance.data.mapState.get().type) {
            mapController.stopMarkerCreator(instance.data.mapState)
        }
        let color = instance.selectedColor.get()
        let text = $('#markerText').val()
if(text){
    let creationOptions = {color: color, text: text}
    mapController.startMarkerCreator('markerText', creationOptions, instance.data.mapState)
}

    }
});

Template.newMarker.onCreated(function () {
    this.selectedColor = new ReactiveVar(mapParams.colors[0])
    this.showMarkerTextSubmit = new ReactiveVar(false)
});

Template.newMarker.onRendered(function () {
    //add your statement here
    $('#markerList').collapsible();

});

Template.newMarker.onDestroyed(function () {
    //add your statement here
});

