import MapMarker from "../../../../../imports/classes/MapMarker";
import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import mapController from "../../../../lib/controllers/mapController";

Template.markerDetail.helpers({
    //add you helpers here
    marker: function () {
        let marker = Template.instance().marker.get()
        Meteor.setTimeout(() => {
            if (marker[marker.markerType]) {
                $('#editMarkerDetail').val(marker[marker.markerType].symEnc_detail);
                $('#editMarkerDetail').trigger('autoresize');
                Materialize.updateTextFields();
            }
        }, 100)

        return marker
    },
    templateName: function () {
        let markerType = Template.instance().marker.get().markerType
        if (markerType) {
            return "detail" + markerType.charAt(0).toUpperCase() + markerType.slice(1);
        } else {
            return null
        }

    },
    data: function () {
        let data = Template.currentData()
        data.marker = Template.instance().marker.get()
        return data
    },
    subData: function () {
        let marker = Template.instance().marker.get()
        return marker[marker.markerType]
    },
    showEditFormButton: function () {
        return Template.instance().showEditFormButton.get()
    },
    coordinates: function () {
        let marker = Template.instance().marker.get()
        if (marker.markerType == "memberPosition" || marker.markerType == "iconMarker" || marker.markerType == "markerText") {

            let coordinatesArray = JSON.parse(marker[marker.markerType].symEnc_coordinates)
            return {lat: coordinatesArray[0], lon: coordinatesArray[1]}
        }

    }
});

Template.markerDetail.events({
    //add your events here
    'keyup #EditMarkerForm': function (event, instance) {
        instance.showEditFormButton.set(true)
        return true
    },
    'submit [editMarker] ': function (event, instance) {
        event.preventDefault()
        let params = {
            symEnc_name: $('#markerName').val(),
            symEnc_detail: $('#editMarkerDetail').val()
        }
        cryptoTools.encryptObject(params, {symKey: Session.get("currentProjectSimKey")}, encryptedParams => {
            instance.marker.get().callMethod(
                "editMarkerTexts",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                encryptedParams,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {

                    }
                })
        })
    },
    'click [deleteMarker]': function (event, instance) {
        event.preventDefault()
        let marker = instance.marker.get()
        marker.callMethod(
            "delete",
            projectController.getAuthInfo(marker.projectId),
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    mapController.removeMarker(instance.marker.get())
                    FlowRouter.go("/project/" + marker.projectId + "/maps")

                }
            })
    },
    'click [moveMarker]': function (event, instance) {
        event.preventDefault()
        mapController.moveMarker(instance.marker.get(), instance.data.mapState)
    },
    'click [goTo]': function (event, instance) {
        if (Meteor.isCordova) {
            let marker = instance.marker.get()
            let coordinatesArray = JSON.parse(marker[marker.markerType].symEnc_coordinates)
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            //
            function onDeviceReady() {
                window.open(encodeURI('geo:0,0?q=' + coordinatesArray[0] + "," + coordinatesArray[1]), '_system');
            }
        } else {
            navigator.geolocation.getCurrentPosition(function (location) {
                let userPosition = [location.coords.latitude, location.coords.longitude]
                let pointToGo = JSON.parse(instance.data.marker[instance.data.marker.markerType].symEnc_coordinates)
                let url = "https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=" + userPosition[0] + "%2C" + userPosition[1] + "%3B" + pointToGo[0] + "%2C" + pointToGo[1]
                var win = window.open(url, '_blank');
                win.focus();
            })

        }

    }
});

Template.markerDetail.onCreated(function () {
    //add your statement here
    this.marker = new ReactiveVar(false)
    this.showEditFormButton = new ReactiveVar(false)
    this.autorun(() => {
        FlowRouter.watchPathChange()
        this.marker.set(false)
        let markerId = FlowRouter.current().queryParams.markerId
        let projectId = FlowRouter.current().params.projectId
        if (markerId) {
            Meteor.subscribe('markerDetail', projectController.getAuthInfo(projectId), markerId, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    this.autorun(() => {
                        let marker = MapMarker.findOne(markerId)
                        if (marker) {
                            cryptoTools.decryptObject(marker[marker.markerType], {symKey: Session.get("currentProjectSimKey")}, decryptedObject => {
                                marker[marker.markerType] = decryptedObject
                                this.marker.set(marker)
                            })
                        }
                    })
                }
            })
        }


    })

});

Template.markerDetail.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.markerDetail.onDestroyed(function () {
    //add your statement here
});

