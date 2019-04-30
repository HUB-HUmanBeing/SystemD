import mapParams from "../../../../lib/controllers/mapParams";
import cryptoTools from "../../../../lib/cryptoTools";
import mapController from "../../../../lib/controllers/mapController";
import projectController from "../../../../lib/controllers/projectController";
import MapMarker from "../../../../../imports/classes/MapMarker";

Template.mapSettings.helpers({
    //add you helpers here
    mapProviders: function () {
        return mapParams.providers
    },
    currentMap: function () {
        return Template.instance().currentMap.get()
    },
    showSaveMap: function () {
        return Template.instance().showSaveMap.get()
    },
    durationOptions: function () {
        return [
            {
                value: 0,
                label: __("mapSettings.chooseDuration")
            },
            {
                value: 24 * 30,
                label: "1 " + __("newInvitation.month")
            },
            {
                value: 24 * 7,
                label: "1 " + __("newInvitation.week")
            },
            {
                value: 24,
                label: "1 " + __("newInvitation.day")
            },
            {
                value: 1,
                label: "1 " + __("newInvitation.hour")
            }
        ]
    },
    colorLegendCallback: function () {
        let instance=Template.instance()
        return function (encryptedColorLegends) {
            instance.data.project.callMethod("editMapLegend",
                projectController.getAuthInfo(instance.data.project._id),
                encryptedColorLegends,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                    }
                })
        }
    }
});

Template.mapSettings.events({
    //add your events here
    'click [selectMap]': function (event, instance) {
        event.preventDefault()
        let id = event.currentTarget.id.split('-')[1]
        if (id !== instance.currentMap.get()) {
            mapController.changeLayer(id)
            instance.currentMap.set(id)
            instance.showSaveMap.set(true)
        }

    },
    'click [saveMap]': function (event, instance) {
        event.preventDefault()
        cryptoTools.sim_encrypt_data(instance.currentMap.get(), Session.get("currentProjectSimKey"), symEnc_mapProvider => {
            instance.data.project.callMethod("editMapProvider",
                projectController.getAuthInfo(instance.data.project._id),
                symEnc_mapProvider,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        instance.showSaveMap.set(false)
                    }
                })
        })

    },
    'click [saveDefaultCenter]': function (event, instance) {
        event.preventDefault()
        let centeringParams = mapController.getCenteringParams()
        cryptoTools.encryptObject(centeringParams, {symKey: Session.get("currentProjectSimKey")}, encryptedCenteringParams => {
            instance.data.project.callMethod("editDefaultCenter",
                projectController.getAuthInfo(instance.data.project._id),
                encryptedCenteringParams,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        Materialize.toast(__('mapSettings.centerSaved'), 6000, 'toastOk')
                    }
                })
        })
    },
    'click [deleteOldMarkers]': function (event, instance) {
        event.preventDefault()
        let duration = Number($("#duration").val())
        let mapMarkerInstance = new MapMarker()
        let projectId = FlowRouter.current().params.projectId
        if (duration) {
            let date = new Date()
            date.setHours(date.getHours() - duration)
            mapMarkerInstance.callMethod("deleteOldsMarkers", projectController.getAuthInfo(projectId), projectId, date, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    Materialize.toast(__('mapSettings.oldsMarkersDeleted'), 6000, 'toastOk')
                }
            })
        }

    }
});

Template.mapSettings.onCreated(function () {
    //add your statement here
    this.currentMap = new ReactiveVar(null)
    this.showSaveMap = new ReactiveVar(false)
    let project = this.data.project
    let encryptedProjectMapParams = project.private.map
    cryptoTools.decryptObject(encryptedProjectMapParams, {symKey: Session.get("currentProjectSimKey")}, projectMapParams => {
        if (!projectMapParams.symEnc_mapProvider) {
            projectMapParams.symEnc_mapProvider = 0
        }
        this.currentMap.set(projectMapParams.symEnc_mapProvider)
    })

});

Template.mapSettings.onRendered(function () {
    //add your statement here
    $('#duration').material_select();
});

Template.mapSettings.onDestroyed(function () {
    //add your statement here

    $('#duration').material_select('destroy');
});

