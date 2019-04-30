import mapParams from "../../../../../lib/controllers/mapParams";
import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";

Template.detailArrow.helpers({
    //add you helpers here
    editingColor: function () {
        return Template.instance().editingColor.get()
    },
    colors: function () {
        return mapParams.colors
    },
});

Template.detailArrow.events({
    //add your events here
    //add your events here
    'click [editColor]': function (event, instance) {
        event.preventDefault()
        resetTooltips()
        instance.editingColor.set(!instance.editingColor.get())
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

Template.detailArrow.onCreated(function () {
    //add your statement here
    this.editingColor = new ReactiveVar(false)
});

Template.detailArrow.onRendered(function () {
    //add your statement here
});

Template.detailArrow.onDestroyed(function () {
    //add your statement here
});

