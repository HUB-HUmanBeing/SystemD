import mapController from "../mapController";
import cryptoTools from "../../cryptoTools";
import MapMarker from "../../../../imports/classes/MapMarker";
import projectController from "../projectController";
import * as L from "leaflet";
import notificationController from "../notificationController";

const shape = {
    saveMarker(options, coordinates, specificOptions) {
        let shape = {
            symEnc_coordinates: coordinates,
            symEnc_color: options.color,
            shapeType: options.shapeType,
            symEnc_radius: specificOptions.radius ? specificOptions.radius.toString() : "0"
        }
        cryptoTools.encryptObject(shape, {symKey: Session.get("currentProjectSimKey")}, encryptedShape => {
            let newMarkerParams = {
                projectId: FlowRouter.current().params.projectId,
                markerType: "shape",
                shape: encryptedShape
            }
            let newMarker = new MapMarker()
            newMarker.callMethod("newShape", projectController.getAuthInfo(newMarkerParams.projectId), newMarkerParams,notificationController.getNotifyAll(), (err, res) => {
                    if (err) {
                        console.log(err)
                        Materialize.toast(__('general.error'), 6000, 'toastError')
                    } else if (!Meteor.Device.isPhone()) {
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
        coordinates[0].forEach(coord => {

            goodOnes.push([coord[1], coord[0]])
        })
        return JSON.stringify([goodOnes])
    },
    formatCoordinatesRectangle(bounds) {
        let coordinates = [
            [bounds._northEast.lat, bounds._northEast.lng],
            [bounds._southWest.lat, bounds._southWest.lng]
        ]

        return JSON.stringify(coordinates)
    },
    initialize(options, mapState) {
        mapController.offEvents()
        mapState.set({currentAction: "creatingShape", type: 'shape', options: options})
        switch (options.shapeType) {
            case "circle":
                mapController.drawControl.setDrawingOptions({
                    circle: {
                        shapeOptions: {
                            color: options.color,
                            weight: 1.5
                        }
                    }
                });
                $('.leaflet-draw-draw-circle')[0].click()
                mapController.addMarker = (e) => {
                    this.saveMarker(options, JSON.stringify([e.layer.toGeoJSON().geometry.coordinates[1], e.layer.toGeoJSON().geometry.coordinates[0]]), {radius: e.layer.options.radius})
                    mapState.set({})
                }

                mapController.map.on("draw:drawstop",(l)=>{
                    mapState.set({})
                });
                break
            case "polygon":
                mapController.drawControl.setDrawingOptions({
                    polygon: {
                        shapeOptions: {
                            color: options.color,
                            weight: 1.5,
                            fill: true,
                            fillColor: null, //same as color by default
                            fillOpacity: 0.2,
                        }
                    }
                });
                $('.leaflet-draw-draw-polygon')[0].click()
                mapController.addMarker = (e) => {
                    this.saveMarker(options, this.formatCoordinates(e.layer.toGeoJSON().geometry.coordinates), {})
                    mapState.set({})
                }
                break
            case "rectangle":
                mapController.drawControl.setDrawingOptions({
                    rectangle: {
                        shapeOptions: {
                            color: options.color,
                            weight: 1.5
                        }
                    }
                });
                $('.leaflet-draw-draw-rectangle')[0].click()
                mapController.addMarker = (e) => {
                    this.saveMarker(options, this.formatCoordinatesRectangle(e.layer._bounds), {})
                    mapState.set({})
                }
                break
            default:
                break
        }

        mapController.map.on("draw:created", mapController.addMarker);
    },
    save(mapState) {
        let actionsBtns = $(".leaflet-draw-actions a")
        actionsBtns[0].click()
        mapState.set({})
    },
    stop(mapState) {
        mapController.offEvents()
        let actionsBtns = $(".leaflet-draw-actions a")
        if (actionsBtns[2]) {
            actionsBtns[2].click()
        } else {
            actionsBtns[0].click()
        }
        mapController.addMarker = () => {
        }
        if (mapState) {

            mapState.set({})
        }
    },
    undo() {
        let actionsBtns = $(".leaflet-draw-actions a")
        actionsBtns[1].click()
    },
    showMarker(marker) {
        cryptoTools.decryptObject(marker.shape, {symKey: Session.get("currentProjectSimKey")}, decryptedShape => {
            let options = {
                color: decryptedShape.symEnc_color,
                weight: 1.5,

            }
            let leafletMarker

            switch (decryptedShape.shapeType) {
                case "circle":

                    options.radius = Number(decryptedShape.symEnc_radius)
                    leafletMarker = L.circle(JSON.parse(decryptedShape.symEnc_coordinates), options)
                    break
                case "rectangle":
                    leafletMarker = L.rectangle(JSON.parse(decryptedShape.symEnc_coordinates), options)
                    break
                case "polygon":
                    leafletMarker = new L.Polygon(JSON.parse(decryptedShape.symEnc_coordinates), options)
                    break
                default:
                    break
            }
            leafletMarker.addTo(mapController.map)
            leafletMarker.on('click', function () {
                FlowRouter.go("/project/" + marker.projectId + "/maps?side=markerDetail&markerId=" + marker._id)
            })
            marker.polyline = decryptedShape
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
export default shape
