import mapController from "../mapController";
import cryptoTools from "../../cryptoTools";
import MapMarker from "../../../../imports/classes/MapMarker";
import projectController from "../projectController";
import * as L from "leaflet";
import notificationController from "../notificationController";
import mapParams from "../mapParams";
import Activity from "../../../../imports/classes/Activity";

const activityMarker = {
    iconHtml(options, id) {

        return `
<div id="${escapeHtml(id)}" class="markerIcon activityIcon ${escapeHtml(options.name) ? "tooltipped" : ""} "
                     ${options.name ? `data-position="top"
                     data-delay="50" data-tooltip="${escapeHtml(options.name)}"` : ""} >
    <a href="${escapeHtml(options.path)}" class="rounded ">
        <i class="material-icons plus-color icon shadow" style="border-color: ${escapeHtml(options.color)}; color: ${escapeHtml(options.color)}">${escapeHtml(options.icon)}</i>
    </a>

    <i class="arrow-down" style="border-top: 8px solid ${escapeHtml(options.color)}"></i>
</div>
`
    },
    mouseFollower(e) {

    },
    createMouseFollower(options) {
        options.color = mapParams.colors[options.activity.color]
        options.icon="event"
        options.name = ""
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
    initialize(options, mapState) {
        if($('#marker-' + options.activity._id)){
            $('#marker-' + options.activity._id).css('opacity', '0.4')
        }
        mapState.set({currentAction: "creatingIcon", type: 'activityMarker', options: options})
        this.createMouseFollower(options)
        this.addMarker = (e) => {
            this.editMarkerCoordinates(options, [e.latlng.lat, e.latlng.lng])
            this.stop()
            this.reroute(options.activity._id)
            mapState.set({})
        }
        mapController.map.on('click', this.addMarker)
    },
    editMarkerCoordinates(options, coordinates) {
        cryptoTools.sim_encrypt_data(JSON.stringify(coordinates), Session.get("currentProjectSimKey"), symEnc_coordinates => {
           let activity = new Activity()
            activity._id = options.activity._id
            activity.callMethod("editActivityPosition", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_coordinates, err => {
                if (err) {
                    console.log(err)
                } else {
                }
            })
        })
    },
    editCoordinates: function (e) {

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
        if(element){
            mapController.map.off('click', this.addMarker)
            element.removeEventListener('mousemove', this.mouseFollower)
            element.remove();
        }
    },
    reroute(activityId){
        let route = Session.get("activityToPositionate")["from"].substring(8);

        Session.set("activityToPositionate", false)
        resetTooltips()
        FlowRouter.go("/project/"+FlowRouter.current().params.projectId+"/"+route+"?side=activityDetail&activityId="+activityId)
    },
    showMarker(activity) {
        cryptoTools.decryptObject(activity, {symKey: Session.get("currentProjectSimKey")}, decryptedIconMarker => {

            let options = {
                color: mapParams.colors[activity.color],
                icon: "event",
                name: decryptedIconMarker.symEnc_title ? decryptedIconMarker.symEnc_title : "",
                path: "/project/" + activity.projectId + "/maps?side=activityDetail&activityId=" + activity._id
            }
            let icon = L.divIcon({
                html: this.iconHtml(options, "marker-" + activity._id)
            })
            let leafletMarker = L.marker(JSON.parse(decryptedIconMarker.symEnc_coordinates), {icon: icon})
            leafletMarker.addTo(mapController.map);
            //leafletMarker.addTo(mapController.map)
            decryptedIconMarker.leafletMarker = leafletMarker
            mapController.activities[activity._id] = decryptedIconMarker
            if(FlowRouter.current().queryParams.activityId === decryptedIconMarker._id){
                this.startHighlightMapIcon(decryptedIconMarker)
            }
            Meteor.setTimeout(() => {
                resetTooltips()
            }, 200)
        })
    },
    editMarker(marker) {
        this.showMarker(marker)
        this.removeMarker(marker)
    },
    removeMarker(activity) {
        let leafletMarker = mapController.activities[activity._id].leafletMarker
        mapController.map.removeLayer(leafletMarker)
    },
    startHighlightMapIcon(activity) {
        Meteor.setTimeout(() => {
            $("#marker-" + activity._id).addClass("highLighted")
            if (mapController.map.panTo) {
                mapController.map.panTo(JSON.parse(activity.symEnc_coordinates));

            } else {
                Meteor.setTimeout(() => {
                    mapController.map.panTo(JSON.parse(activity.symEnc_coordinates));
                }, 1000)
            }

        }, 100)

    },
    stopHighlightMapIcon(activityId) {
        $("#marker-" + activityId).removeClass("highLighted")

    },
}
export default activityMarker
