import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import Pad from "/imports/classes/Pad";
import padController from "../../../../../lib/controllers/padController";

Template.padHeader.helpers({
    //add you helpers here
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    isDownloading: function () {
        return Template.instance().isDownloading.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    isEditable: function () {
        let projectId = FlowRouter.current().params.projectId
        let isCreator = Template.currentData().currentPad.createdBy === projectController.getCurrentUserProject(projectId).asymEnc_memberId
        let isAdmin = projectController.isAdmin(projectId)
        return (isAdmin || isCreator)
    },
});

Template.padHeader.events({
    //add your events here
    'click [editName]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#editPadName').focus()
            resetTooltips()
        }, 200)
        instance.isEditing.set(true)
    },
    'click [showDelete]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        instance.showDelete.set(true)
    },
    'submit [editPadForm]': function (event, instance) {
        event.preventDefault()
        let pad = Pad.findOne(FlowRouter.current().queryParams.padId)
        let padName = event.target.editPadName.value
        cryptoTools.sim_encrypt_data(padName, Session.get("currentProjectSimKey"), (symEnc_name) => {
            pad.callMethod("editName", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_name, (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    instance.isEditing.set(false)
                    Meteor.setTimeout(() => {
                        resetTooltips()
                    }, 200)
                }
            })
        })
    },
    'click [abortDelete]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        instance.showDelete.set(false)
    },
    'click [delete]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        let pad = Pad.findOne(FlowRouter.current().queryParams.padId)
        let projectId = FlowRouter.current().params.projectId
        FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/forum")
        pad.callMethod("delete", projectController.getAuthInfo(projectId), (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                instance.showDelete.set(false)
                Materialize.toast(__('padHeader.deleteSuccess'), 6000, 'toastOk')
            }
        })
    },
    'click [downloadPdf]': function (event, instance) {
        event.preventDefault()
        if (!instance.isDownloading.get()) {
            instance.isDownloading.set(true)
            resetTooltips()
            padController.download("pdf", instance.data.currentPad.symEnc_name, () => {
                instance.isDownloading.set(false)
                resetTooltips()
            })
        }
    },
    'click [downloadDocx]': function (event, instance) {
        event.preventDefault()
        if (!instance.isDownloading.get()) {
            instance.isDownloading.set(true)
            resetTooltips()
            padController.download("docx", instance.data.currentPad.symEnc_name, () => {
                instance.isDownloading.set(false)
                resetTooltips()
            })
        }
    }
});

Template.padHeader.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.isDownloading = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
    this.showCloseSearch = new ReactiveVar(false)
});

Template.padHeader.onRendered(function () {
    //add your statement here
});

Template.padHeader.onDestroyed(function () {
    //add your statement here
});

