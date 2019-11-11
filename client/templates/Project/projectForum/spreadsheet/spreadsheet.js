import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Spreadsheet from "/imports/classes/Spreadsheet";
import Project from "../../../../../imports/classes/Project";
import Publications from "../../../../../lib/collections/Publications";
import Publication from "../../../../../imports/classes/Publication";

Template.spreadsheet.helpers({
    //add you helpers here
    currentSpreadsheet: function () {

        return Template.instance().currentSpreadsheet.get()
    },
    isRefreshing: function () {
        return Template.instance().isRefreshing.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },

});

Template.spreadsheet.events({
    //add your events here
});

Template.spreadsheet.onCreated(function () {
    //add your statement here
    this.currentSpreadsheet = new ReactiveVar()
    this.isRefreshing = new ReactiveVar(true)
    this.projectId = new ReactiveVar(null)
    this.handlerSubscription = null
    this.pinnedPublication = new ReactiveVar(false)
    this.autorun(() => {

        this.isRefreshing.set(true)
        FlowRouter.watchPathChange()
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        if (currentProject) {

            this.projectId.set(FlowRouter.current().params.projectId)
            let spreadsheetId = FlowRouter.current().queryParams.spreadsheetId
            this.handlerSubscription = Meteor.subscribe("singleSpreadsheet", projectController.getAuthInfo(this.projectId.get()), spreadsheetId, this.projectId.get(), err => {

                if (err) {
                    console.log(err)
                } else {
                    let encryptedSpreadsheet = Spreadsheet.findOne({_id: spreadsheetId})
                    cryptoTools.decryptObject(encryptedSpreadsheet, {symKey: Session.get("currentProjectSimKey")}, (spreadsheet) => {
                        this.currentSpreadsheet.set(spreadsheet)
                        console.log(spreadsheet)
                        this.isRefreshing.set(false)
                    })
                }
            })
        }
    })
});

Template.spreadsheet.onRendered(function () {
    //add your statement here
});

Template.spreadsheet.onDestroyed(function () {
    //add your statement here
});

