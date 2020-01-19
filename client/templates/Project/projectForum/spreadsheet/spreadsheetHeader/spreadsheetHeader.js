import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import Spreadsheet from "/imports/classes/Spreadsheet";
import Papa from "papaparse"

Template.spreadsheetHeader.helpers({
    //add you helpers here
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    showUpload: function () {
        return Template.instance().showUpload.get()
    },
    isEditable: function () {
        let projectId = FlowRouter.current().params.projectId
        let isCreator = Template.currentData().currentSpreadsheet.createdBy === projectController.getCurrentUserProject(projectId).asymEnc_memberId
        let isAdmin = projectController.isAdmin(projectId)
        return (isAdmin || isCreator)
    },
    showCloseSearch: function () {
        return Template.instance().showCloseSearch.get()
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
            spreadsheet.callMethod("editName", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_name, (err, res) => {
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
        FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/forum")
        spreadsheet.callMethod("delete", projectController.getAuthInfo(projectId), (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                instance.showDelete.set(false)
                Materialize.toast(__('spreadsheetHeader.deleteSuccess'), 6000, 'toastOk')
            }
        })
    },
    'click [search]': function (event, instance) {
        let searchInput = $('.jexcel_filter input')
        if (searchInput.hasClass("searchVisible")) {
            searchInput.val("")
            if(table && table.resetSearch){
                table.resetSearch()
            }
            searchInput.removeClass("searchVisible")
            instance.showCloseSearch.set(false)
        } else {
            searchInput.addClass("searchVisible")
            instance.showCloseSearch.set(true)
        }

    },
    'click [startUploadFile]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        instance.showUpload.set(true)
    },
    'click [abortUpload]': function (event, instance) {
        event.preventDefault()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        instance.showUpload.set(false)
    },
    'click [upload]': function () {
        $('#uploadSpreadsheet').click()
    },
    'change [uploadSpreadsheet]': function (event, instance) {
        let selectedFile = event.currentTarget.files[0]
        let reader = new FileReader();
        if (selectedFile.type != "text/csv") {
            Materialize.toast(__("spreadsheetHeader.onlyCsvError"), 6000, "toastError")
            return false
        }
        reader.onload = function (event) {
            let csv = event.target.result;
            let parsedArray = Papa.parse(csv)
            let formattedArray = []
            let maxLengthRow = 20
            parsedArray.data.forEach(row => {
                let newRow = {}
                if (row.length > maxLengthRow) {
                    maxLengthRow = row.length
                }
                if (row.length < 20) {
                    for (let i = 0; i < 20 - row.length; i++) {
                        row.push(" ")
                    }
                }
                row.forEach((item, i) => {
                    newRow[i] = item
                })
                formattedArray.push(newRow)
            })
            if (formattedArray.lenght < 60) {
                let emptyRow = {}
                for (let i = 0; i < maxLengthRow; i++) {
                    emptyRow[i] = " "
                }
                for (let i = 0; i < 60 - formattedArray.length; i++) {
                    formattedArray.push(emptyRow)
                }
            }
            let currentSpreadsheet = Spreadsheet.findOne(FlowRouter.current().queryParams.spreadsheetId)
            cryptoTools.sim_encrypt_data(JSON.stringify(formattedArray), Session.get("currentProjectSimKey"), (symEnc_datas) => {

                currentSpreadsheet.callMethod("saveColumns", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_datas,"[]","" ,(err, res) => {
                    if (err) {
                        console.log(err)
                        Materialize.toast(__("general.error"), 6000, "toastError")
                    } else {
                        instance.data.refreshRender()
                    }
                })
            })
        };
        reader.onerror = function (event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        reader.readAsText(selectedFile);

    }
});

Template.spreadsheetHeader.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
    this.showUpload = new ReactiveVar(false)
    this.showCloseSearch = new ReactiveVar(false)
});

Template.spreadsheetHeader.onRendered(function () {
    //add your statement here
});

Template.spreadsheetHeader.onDestroyed(function () {
    //add your statement here
});

