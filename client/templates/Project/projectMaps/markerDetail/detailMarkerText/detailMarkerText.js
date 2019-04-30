import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import mapParams from "../../../../../lib/controllers/mapParams";

Template.detailMarkerText.helpers({
    //add you helpers here
    editingColor: function () {
        return Template.instance().editingColor.get()
    },
    colors: function () {
        return mapParams.colors
    },
});

Template.detailMarkerText.events({
    //add your events here
    'click [editColor]': function (event, instance) {
        event.preventDefault()
        instance.editingColor.set(!instance.editingColor.get())
        resetTooltips()
    },
    'click [selectColor]': function (event, instance) {
        event.preventDefault()
        let color = event.currentTarget.id.split("-")[1]
        cryptoTools.sim_encrypt_data(color, Session.get("currentProjectSimKey"), encryptedColor => {
            instance.data.marker.callMethod("changeColor", projectController.getAuthInfo(FlowRouter.current().params.projectId), encryptedColor, err => {
                if (err) {
                    console.log(err)
                } else {
                    instance.editingColor.set(false)
                }
            })
        })

    },
});

Template.detailMarkerText.onCreated(function () {
    //add your statement here
    this.editingColor = new ReactiveVar(false)
});

Template.detailMarkerText.onRendered(function () {
    //add your statement here
});

Template.detailMarkerText.onDestroyed(function () {
    //add your statement here
});

