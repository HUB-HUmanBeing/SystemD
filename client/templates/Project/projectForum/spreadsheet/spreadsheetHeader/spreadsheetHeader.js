import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import Spreadsheet from "/imports/classes/Spreadsheet";

Template.spreadsheetHeader.helpers({
    //add you helpers here
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    isEditable: function () {
        let projectId = FlowRouter.current().params.projectId
        let isCreator = Template.currentData().currentSpreadsheet.createdBy === projectController.getCurrentUserProject(projectId).memberId
        let isAdmin= projectController.isAdmin(projectId)
        return  (isAdmin || isCreator)
    }
});

Template.spreadsheetHeader.events({
    //add your events here
    'click [editName]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#editSpreadsheetName').focus()
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
    'submit [editSpreadsheetForm]': function (event, instance) {
        event.preventDefault()
        let spreadsheet = Spreadsheet.findOne(FlowRouter.current().queryParams.spreadsheetId)
        let spreadsheetName = event.target.editSpreadsheetName.value
        cryptoTools.sim_encrypt_data(spreadsheetName, Session.get("currentProjectSimKey"), (symEnc_name) => {
            spreadsheet.callMethod("editName", projectController.getAuthInfo(FlowRouter.current().params.projectId),  symEnc_name, (err, res) => {
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
        let spreadsheet = Spreadsheet.findOne(FlowRouter.current().queryParams.spreadsheetId)
        let projectId = FlowRouter.current().params.projectId
        FlowRouter.go("/project/"+FlowRouter.current().params.projectId+"/forum")
        spreadsheet.callMethod("delete", projectController.getAuthInfo(projectId), (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                instance.showDelete.set(false)
                Materialize.toast(__('spreadsheetHeader.deleteSuccess'), 6000, 'toastOk')
            }
        })
    }
});

Template.spreadsheetHeader.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
});

Template.spreadsheetHeader.onRendered(function () {
    //add your statement here
});

Template.spreadsheetHeader.onDestroyed(function () {
    //add your statement here
});

