import mapController from "../mapController";
import cryptoTools from "../../cryptoTools";
import MapMarker from "../../../../imports/classes/MapMarker";
import projectController from "../projectController";
import * as L from "leaflet";

const iconMarker = {
    iconHtml(options, id) {
        return `
<div class="markerIcon" id="${escapeHtml(id)}">
    <a href="${escapeHtml(options.path)}" class="rounded ${escapeHtml(options.name) ? "tooltipped" : ""} "
                     data-position="top"
                     data-delay="50" data-tooltip="${escapeHtml(options.name)}">
        <i class="material-icons plus-color icon shadow" style="background-color: ${escapeHtml(options.color)}">${escapeHtml(options.icon)}</i>
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
            x = event.clientX - 17;
            y = event.clientY - 42;
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
            symEnc_icon: options.icon
        }
        cryptoTools.encryptObject(newIconMarker, {symKey: Session.get("currentProjectSimKey")}, encryptedNewIconMarker => {
            let newMarkerParams = {
                projectId: FlowRouter.current().params.projectId,
                markerType: "iconMarker",
                iconMarker: encryptedNewIconMarker
            }
            let newMarker = new MapMarker()
            newMarker.callMethod("newIconMarker", projectController.getAuthInfo(newMarkerParams.projectId), newMarkerParams, (err, res) => {
                    if (err) {
                        console.log(err)
                        Materialize.toast(__('general.error'), 6000, 'toastError')
                    } else {
                        console.log(res)
                    }
                }
            )
        })

    },
    initialize(options, mapState) {
        this.createMouseFollower(options)
        this.addMarker = (e) => {
            this.saveMarker(options, [e.latlng.lat, e.latlng.lng])
            this.stop()
            mapState.set({})
        }
        mapController.map.on('click', this.addMarker)
    },
    stop() {
        let element = document.getElementById("newIconMarker");
        mapController.map.off('click', this.addMarker)
        element.removeEventListener('mousemove', this.mouseFollower)
        element.remove();
    },
    showMarker(marker) {
        cryptoTools.decryptObject(marker.iconMarker, {symKey: Session.get("currentProjectSimKey")}, decryptedIconMarker => {
            let options = {
                color: decryptedIconMarker.symEnc_color,
                icon: decryptedIconMarker.symEnc_icon,
                name: decryptedIconMarker.symEnc_name ? decryptedIconMarker.symEnc_name : "",
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
            console.log(mapController.markers)
            Meteor.setTimeout(() => {
                resetTooltips()
            }, 200)
        })
    },
    editMarker(marker) {
        this.removeMarker(marker)
        this.showMarker(marker)
    },
    removeMarker(marker) {
        mapController.map.removeLayer(marker)
        marker.leafletMarker.remove()
        console.log("todo: removemarker")
    }
}
export default iconMarker
