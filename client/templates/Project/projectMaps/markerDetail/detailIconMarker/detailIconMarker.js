import iconMarker from "../../../../../lib/controllers/markers/iconMarker";
import mapParams from "../../../../../lib/controllers/mapParams";
import mapController from "../../../../../lib/controllers/mapController";
import projectController from "../../../../../lib/controllers/projectController";
import cryptoTools from "../../../../../lib/cryptoTools";

Template.detailIconMarker.helpers({
    //add you helpers here
    marker: function () {
        return Template.currentData().marker
    },
    editingColor: function () {
        return Template.instance().editingColor.get()
    },
    editingIcon: function () {
        return Template.instance().editingIcon.get()
    },
    colors: function () {
        return mapParams.colors
    },
    icons: function () {
        return mapParams.shapes.icons
    },
});

Template.detailIconMarker.events({
    //add your events here
    'click [editIcon]': function (event, instance) {
        event.preventDefault()
        instance.editingIcon.set(!instance.editingIcon.get())
        instance.editingColor.set(false)
    },
    'click [editColor]': function (event, instance) {
        event.preventDefault()
        instance.editingIcon.set(false)
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
    'click [selectIcon]': function (event, instance) {
        event.preventDefault()
        let icon = event.currentTarget.id.split("#")[2]
        cryptoTools.sim_encrypt_data(icon, Session.get("currentProjectSimKey"), encryptedIcon => {
            instance.data.marker.callMethod("changeIcon", projectController.getAuthInfo(FlowRouter.current().params.projectId), encryptedIcon, err => {
                if (err) {
                    console.log(err)
                } else {
                    instance.editingIcon.set(false)
                }
            })
        })
    }
});

Template.detailIconMarker.onCreated(function () {
    //add your statement here
    iconMarker.startHighlightMapIcon(this.data.marker)
    this.editingColor = new ReactiveVar(false)
    this.editingIcon = new ReactiveVar(false)
});

Template.detailIconMarker.onRendered(function () {
    //add your statement here
});

Template.detailIconMarker.onDestroyed(function () {
    //add your statement here
    iconMarker.stopHighlightMapIcon(this.data.marker._id)
});

