import * as L from "leaflet";
import cryptoTools from "../cryptoTools";
import mapParams from "./mapParams";
import MiniMap from 'leaflet-minimap';
import iconMarker from "./markers/iconMarker";
import MapMarker from "../../../imports/classes/MapMarker";

const mapController = {
    map: {},
    minimap: {},
    currentLayer: {},
    initialize(project, instance) {
        let encryptedProjectMapParams = project.private.map
        cryptoTools.decryptObject(encryptedProjectMapParams, {symKey: Session.get("currentProjectSimKey")}, projectMapParams => {
            if (!projectMapParams.symEnc_mapProvider) {
                projectMapParams.symEnc_mapProvider = 0
            }
            if (!projectMapParams.symEnc_center) {
                projectMapParams.symEnc_center = JSON.stringify([47, 2.5])
            }


            this.map = L.map("map").setView(JSON.parse(projectMapParams.symEnc_center), projectMapParams.zoomLevel);

            this.currentLayer = L.tileLayer(
                mapParams.providers[projectMapParams.symEnc_mapProvider].url,
                mapParams.providers[projectMapParams.symEnc_mapProvider].options
            ).addTo(this.map);
            L.control.scale({
                imperial: false,
                maxWidth: 116
            }).addTo(this.map);
            //terminator().addTo(this.map);
            if (!Meteor.Device.isPhone()) {
                let osm2 = new L.TileLayer(mapParams.providers[0].url, {
                    minZoom: 0,
                    maxZoom: 13,
                    attribution: mapParams.providers[projectMapParams.symEnc_mapProvider].options.attribution
                });
                this.minimap = new L.Control.MiniMap(osm2, {
                    position: 'bottomleft',
                    width: 120,
                    height: 120,
                    zoomLevelOffset: -6
                }).addTo(this.map);
            }
            this.promptMarkers(project._id, instance)
        })


    },
    changeLayer(id) {
        let newLayer = L.tileLayer(
            mapParams.providers[id].url,
            mapParams.providers[id].options
        )

        this.map.addLayer(newLayer);
        window.setTimeout(() => {
            this.map.removeLayer(this.currentLayer);
            this.currentLayer = newLayer
        }, 2000)
    },
    getCenteringParams() {
        let centeringParams = {
            symEnc_center: JSON.stringify(this.map.getCenter()),
            zoomLevel: this.map.getZoom()
        }
        return centeringParams
    },
    iconMarker: iconMarker,
    startMarkerCreator(type, options, mapState) {
        this[type].default.initialize(options, mapState)
        mapState.set({currentAction: "creatingIcon", type: 'iconMarker', options: options})
    },
    moveMarker(marker, mapState) {
        this[marker.markerType].default.moveMarker(marker, mapState)
        mapState.set({currentAction: "editingIcon", type: 'iconMarker', options: {}, marker: marker})
    },
    stopEtitingMarker(mapState) {
        this[mapState.get().type].default.stopEditing(mapState.get().marker)
    },
    stopMarkerCreator(mapState) {
        this[mapState.get().type].default.stop()
    },
    editMarkerCreatorColor(mapState, color) {
        this.stopMarkerCreator(mapState)
        let newOptions = mapState.get().options
        newOptions.color = color
        this.startMarkerCreator(mapState.get().type, newOptions, mapState)
    },
    markers: {},
    promptMarkers(projectId, instance) {
        instance.autorun(() => {
            let markers = MapMarker.find({projectId: projectId}).fetch()

            markers.forEach((marker) => {
                if (!this.markers[marker._id]) {
                    this[marker.markerType].default.showMarker(marker)
                } else if (marker.lastEditAt.getTime() > this.markers[marker._id].lastEditAt.getTime()) {
                    this[marker.markerType].default.editMarker(marker)
                }
            })
        })

    },
    removeMarker(marker) {
        this[marker.markerType].default.removeMarker(marker)
    }
}
export default mapController
