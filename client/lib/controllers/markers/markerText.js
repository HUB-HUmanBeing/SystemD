import mapController from "../mapController";
import cryptoTools from "../../cryptoTools";
import MapMarker from "../../../../imports/classes/MapMarker";
import projectController from "../projectController";
import * as L from "leaflet";
import notificationController from "../notificationController";

const markerText = {
    iconHtml(options, id) {
        return `
<div id="${escapeHtml(id)}" class="markerText" >
    <a href="${escapeHtml(options.path)}" class=" small-shadow" style="color: ${escapeHtml(options.color)}">
        ${escapeHtml(options.text)}
    </a>

    <i class="arrow-down" style="border-top: 8px solid ${escapeHtml(options.color)}"></i>
</div>
`
    },
    mouseFollower(e) {

    },
    createMouseFollower(options) {
        $("#mapContainer").append(this.iconHtml(options, "newIconMarker"))
        let bsDiv = document.getElementById("newIconMarker");
        let x, y;
        this.mouseFollower = function (event) {
            x = event.clientX -4;
            y = event.clientY -4;
            if (typeof x !== 'undefined') {
                bsDiv.style.left = x + "px";
                bsDiv.style.top = y + "px";
            }
        }
        //On mousemove use event.clientX and event.clientY to set the location of the div to the location of the cursor:
        window.addEventListener('mousemove', this.mouseFollower
            , false);
    },
    addMarker: function (e) {

    },
    saveMarker(options, coordinates) {
        let newIconMarker = {
            symEnc_coordinates: JSON.stringify(coordinates),
            symEnc_color: options.color,
            symEnc_name: options.text
        }
        cryptoTools.encryptObject(newIconMarker, {symKey: Session.get("currentProjectSimKey")}, encryptedNewIconMarker => {
            let newMarkerParams = {
                projectId: FlowRouter.current().params.projectId,
                markerType: "markerText",
                markerText: encryptedNewIconMarker
            }
            let newMarker = new MapMarker()
            newMarker.callMethod("newMarkerText", projectController.getAuthInfo(newMarkerParams.projectId), newMarkerParams, notificationController.getNotifyAll(), (err, res) => {
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
    initialize(options, mapState) {
        mapState.set({currentAction: "creatingIcon", type: 'iconMarker', options: options})
        this.createMouseFollower(options)
        this.addMarker = (e) => {
            this.saveMarker(options, [e.latlng.lat, e.latlng.lng])
            this.stop()
            mapState.set({})
        }
        mapController.map.on('click', this.addMarker)
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
    moveMarker(marker, mapState) {
        $('#marker-' + marker._id).css('opacity', '0.4')
        this.createMouseFollower({
            color: marker[marker.markerType].symEnc_color,
            text: marker[marker.markerType].symEnc_name
        }, "newIconMarker")
        this.editCoordinates = (e) => {
            this.editMarkerCoordinates(marker, [e.latlng.lat, e.latlng.lng])
            this.stopEditing(marker)
            mapState.set({})
        }
        mapController.map.on('click', this.editCoordinates)

    },
    stopEditing(marker) {
        $('#marker-' + marker._id).css('opacity', '1')
        let element = document.getElementById("newIconMarker");
        mapController.map.off('click', this.editCoordinates)
        element.removeEventListener('mousemove', this.mouseFollower)
        element.remove();
    },
    stop() {
        let element = document.getElementById("newIconMarker");
        if (element) {
            mapController.map.off('click', this.addMarker)
            element.removeEventListener('mousemove', this.mouseFollower)
            element.remove();
        }

    },
    showMarker(marker) {
        cryptoTools.decryptObject(marker.markerText, {symKey: Session.get("currentProjectSimKey")}, decryptedIconMarker => {
            let options = {
                color: decryptedIconMarker.symEnc_color,
                text: decryptedIconMarker.symEnc_name ? decryptedIconMarker.symEnc_name : "",
                path: "/project/" + marker.projectId + "/maps?side=markerDetail&markerId=" + marker._id
            }
            let icon = L.divIcon({
                html: this.iconHtml(options, "marker-" + marker._id)
            })
            let leafletMarker = L.marker(JSON.parse(decryptedIconMarker.symEnc_coordinates), {icon: icon})
            leafletMarker.addTo(mapController.map);
            //leafletMarker.addTo(mapController.map)
            marker.iconMarker = decryptedIconMarker
            marker.leafletMarker = leafletMarker
            mapController.markers[marker._id] = marker
            Meteor.setTimeout(() => {
                resetTooltips()
            }, 200)
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
    startHighlightMapIcon(marker) {
        Meteor.setTimeout(() => {
            $("#marker-" + marker._id).addClass("highLighted")
            if (mapController.map.panTo) {
                mapController.map.panTo(JSON.parse(marker.iconMarker.symEnc_coordinates));

            } else {
                Meteor.setTimeout(() => {
                    mapController.map.panTo(JSON.parse(marker.iconMarker.symEnc_coordinates));
                }, 1000)
            }

        }, 100)

    },
    stopHighlightMapIcon(markerId) {
        $("#marker-" + markerId).removeClass("highLighted")
    },
}
export default markerText
