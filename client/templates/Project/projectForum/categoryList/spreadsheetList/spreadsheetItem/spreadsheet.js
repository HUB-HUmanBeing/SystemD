import projectController from "../../../../../../lib/controllers/projectController";
import Project from "../../../../../../../imports/classes/Project";

Template.spreadsheetItem.helpers({
    //add you helpers here
    isCurrentSpreadsheet: function () {
        FlowRouter.watchPathChange()
        if(Template.currentData().isPad){
            return Template.currentData().spreadsheet._id === FlowRouter.current().queryParams.padId
        }else{
            return Template.currentData().spreadsheet._id === FlowRouter.current().queryParams.spreadsheetId
        }

    },
});

Template.spreadsheetItem.events({
    //add your events here
});

Template.spreadsheetItem.onCreated(function () {
    //add your statement here
    this.isDrag = new ReactiveVar(false)
});

Template.spreadsheetItem.onRendered(function () {
    //add your statement here
    resetTooltips()

});

Template.spreadsheetItem.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

