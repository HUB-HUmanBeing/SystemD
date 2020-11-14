import mapController from "../mapController";
import cryptoTools from "../../cryptoTools";
import MapMarker from "../../../../imports/classes/MapMarker";
import projectController from "../projectController";
import * as L from "leaflet";
import notificationController from "../notificationController";

const polyline = {

    saveMarker(options, coordinates) {
        mapController.offEvents()
        let polyline = {
            symEnc_coordinates: coordinates,
            symEnc_color: options.color
        }
        cryptoTools.encryptObject(polyline, {symKey: Session.get("currentProjectSimKey")}, encryptedPolyline => {
            let newMarkerParams = {
                projectId: FlowRouter.current().params.projectId,
                markerType: "polyline",
                polyline: encryptedPolyline
            }
            let newMarker = new MapMarker()
            newMarker.callMethod("newPolyline", projectController.getAuthInfo(newMarkerParams.projectId), newMarkerParams, notificationController.getNotifyAll(), (err, res) => {
                    if (err) {
                        console.log(err)
                        Materialize.toast(__('general.error'), 6000, 'toastError')
                    } else if (!Meteor.Device.isPhone()){
                        FlowRouter.go("/project/" + newMarkerParams.projectId + "/maps?side=markerDetail&markerId=" + res)
                        Meteor.setTimeout(() => {
                            $('#markerName').focus()
                        }, 300)
                    }else{
                        FlowRouter.go("/project/" + newMarkerParams.projectId + "/maps")
                    }
                }
            )
        })

    },
    formatCoordinates(coordinates) {
        let goodOnes = []
        coordinates.forEach(coord => {
            let temp = coord[0]
            coord[0] = coord[1]
            coord[1] = temp
            goodOnes.push(coord)
        })
        return JSON.stringify(goodOnes)
    },
    initialize(options, mapState) {
        mapController.offEvents()
        mapState.set({currentAction: "creatingPolyline", type: 'polyline', options: options})
        mapController.drawControl.setDrawingOptions({
            polyline: {
                shapeOptions: {
                    color: options.color,
                    weight: 1.5
                }
            }
        });
        $('.leaflet-draw-draw-polyline')[0].click()
        mapController.addMarker = (e) => {
            this.saveMarker(options, this.formatCoordinates(e.layer.toGeoJSON().geometry.coordinates))
            mapState.set({})
        }
        mapController.map.on("draw:created", mapController.addMarker);
    },
    editMarkerCoordinates(marker, coordinates) {
        cryptoTools.sim_encrypt_data(JSON.stringify(coordinates), Session.get("currentProjectSimKey"), symEnc_coordinates => {
            marker.callMethod("moveMarker", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_coordinates, err => {
                if (err) {
                    console.log(err)
                } else {

                }
            })
        })
    },
    editCoordinates: function (e) {

    },
    save(mapState) {
        let actionsBtns = $(".leaflet-draw-actions a")
        actionsBtns[0].click()
        mapState.set({})
    },
    moveMarker(marker, mapState) {
        $('#marker-' + marker._id).css('opacity', '0.4')
        this.createMouseFollower({
            color: marker[marker.markerType].symEnc_color,
            icon: marker[marker.markerType].symEnc_icon
        }, "newIconMarker")
        this.editCoordinates = (e) => {
            this.editMarkerCoordinates(marker, [e.latlng.lat, e.latlng.lng])
            this.stopEditing(marker)
            mapState.set({})
        }
        mapController.map.on('click', this.editCoordinates)

    },
    stop(mapState) {
        mapController.offEvents()
        let actionsBtns = $(".leaflet-draw-actions a")
        actionsBtns[2].click()
        if (mapState) {
            mapState.set({})
        }
    },
    undo() {
        let actionsBtns = $(".leaflet-draw-actions a")
        actionsBtns[1].click()
    },
    showMarker(marker) {
        cryptoTools.decryptObject(marker.polyline, {symKey: Session.get("currentProjectSimKey")}, decryptedPolyline => {
            let options = {
                color: decryptedPolyline.symEnc_color,
                weight: 1.5
            }
            let leafletMarker = new L.Polyline(JSON.parse(decryptedPolyline.symEnc_coordinates), options)
            leafletMarker.addTo(mapController.map)
            leafletMarker.on('click', function () {
                FlowRouter.go("/project/" + marker.projectId + "/maps?side=markerDetail&markerId=" + marker._id)
            })
            marker.polyline = decryptedPolyline
            marker.leafletMarker = leafletMarker
            mapController.markers[marker._id] = marker
        })
    },
    editMarker(marker) {
        this.showMarker(marker)
        this.removeMarker(marker)
    },
    removeMarker(marker) {
        let leafletMarker = mapController.markers[marker._id].leafletMarker
        mapController.map.removeLayer(leafletMarker)
    },
}
export default polyline
