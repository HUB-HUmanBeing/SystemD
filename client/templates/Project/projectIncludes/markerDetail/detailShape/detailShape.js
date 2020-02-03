import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import mapParams from "../../../../../lib/controllers/mapParams";

Template.detailShape.helpers({
    //add you helpers here
    editingColor: function () {
        return Template.instance().editingColor.get()
    },
    colors: function () {
        return mapParams.colors
    },
    shapeIcon: function () {
        switch (Template.currentData().marker.shape.shapeType) {
            case "circle":
                return "radio_button_unchecked"
                break
            case "rectangle":
                return "crop_landscape"
                break
            case "polygon":
                return "star_border"
                break
            default:
                break
        }
    }
});

Template.detailShape.events({
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

Template.detailShape.onCreated(function () {
    //add your statement here
    this.editingColor = new ReactiveVar(false)
});

Template.detailShape.onRendered(function () {
    //add your statement here
});

Template.detailShape.onDestroyed(function () {
    //add your statement here
});

