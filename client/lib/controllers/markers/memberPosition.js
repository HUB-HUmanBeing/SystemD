import mapController from "../mapController";
import cryptoTools from "../../cryptoTools";
import MapMarker from "../../../../imports/classes/MapMarker";
import projectController from "../projectController";
import * as L from "leaflet";
import avatarStore from "../../filesStore/avatarStore";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-identicon-sprites";

const memberPosition = {
    iconHtml(options, id) {
        let avatarUrl = avatarStore.getUserAvatar(options.userId)
        let svgOptions = {padding: 0, background: '#165261'};
        let avatars = new Avatars(sprites(svgOptions));
        let avatarSvg = avatars.create(options.userId);
        let html = `
<div id="${escapeHtml(id)}" class="markerIcon ${escapeHtml(options.name) ? "tooltipped" : ""} "
                     data-position="top"
                     data-delay="50" data-tooltip="${escapeHtml(options.name)}" >
    <a href="${escapeHtml(options.path)}" class="rounded ">
        <div class=" plus-color memberPin shadow" style="border-color: ${escapeHtml(options.color)};"/>`
        if (avatarUrl !== "noAvatar") {
            html += ` <img src="${avatarUrl}" alt="" class="avatar responsive-img relative" style="z-index:200; ">`

        } else {
            html += `<div class="absolute full-width full-height" style="top: 0 ">
                ${avatarSvg}
            </div>`
        }
        html += `</div>
    </a>
    <i class="arrow-down" style="border-top: 8px solid ${escapeHtml(options.color)}"></i>
</div>
`
        return html
    },
    editUserPosition(mapState) {
        mapController.stopMarkerCreator(mapState)
        navigator.geolocation.getCurrentPosition(function (location) {
            let coordinates = [location.coords.latitude, location.coords.longitude]
            cryptoTools.sim_encrypt_data(JSON.stringify(coordinates), Session.get("currentProjectSimKey"), encryptedCoordinates => {

                let newMarker = new MapMarker()
                let projectId = FlowRouter.current().params.projectId
                newMarker.callMethod("updateMemberPosition", projectController.getAuthInfo(projectId), projectId, encryptedCoordinates, (err, res) => {
                    if (err) {
                        console.log(err)
                        Materialize.toast(__('general.error'), 6000, 'toastError')
                    } else {

                        if (mapController.map.panTo) {
                            mapController.map.panTo(coordinates);

                        } else {
                            Meteor.setTimeout(() => {
                                mapController.map.panTo(coordinates);
                            }, 1000)
                        }

                    }
                })
            })
        }, (e)=>{console.log(JSON.stringify(e))}, { timeout: 3000 })
    },
    showMarker(marker) {
        cryptoTools.decryptObject(marker.memberPosition, {symKey: Session.get("currentProjectSimKey")}, decryptedIconMarker => {
            let requiredMember = {}
            Session.get("currentProjectMembers").forEach((member) => {
                if (member.memberId === marker.memberPosition.memberId) {
                    requiredMember = member
                }
            })
            let options = {
                name: requiredMember.symEnc_username,
                userId: requiredMember.symEnc_userId,
                color: "#165261",
                memberId: marker.memberPosition.memberId,
                path: "/project/" + marker.projectId + "/maps?side=markerDetail&markerId=" + marker._id
            }
            let icon = L.divIcon({
                html: this.iconHtml(options, "marker-" + marker._id)
            })
            let leafletMarker = L.marker(JSON.parse(decryptedIconMarker.symEnc_coordinates), {icon: icon})
            leafletMarker.addTo(mapController.map);
            //leafletMarker.addTo(mapController.map)
            marker.memberPosition = decryptedIconMarker
            marker.leafletMarker = leafletMarker
            mapController.markers[marker._id] = marker
            Meteor.setTimeout(() => {
                resetTooltips()
            }, 200)
        })
    }
    ,
    editMarker(marker) {
        this.showMarker(marker)
        this.removeMarker(marker)
    },
    removeMarker(marker) {
        let leafletMarker = mapController.markers[marker._id].leafletMarker
        mapController.map.removeLayer(leafletMarker)
    },

}
export default memberPosition
