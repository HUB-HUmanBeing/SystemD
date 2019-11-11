
import spreadsheetController from "../../../../../lib/controllers/spreadsheetController";

Template.spreadsheetContent.helpers({
    //add you helpers here
});

Template.spreadsheetContent.events({
    //add your events here
});

Template.spreadsheetContent.onCreated(function () {
    //add your statement here
    this.spreadsheetController = spreadsheetController
});

Template.spreadsheetContent.onRendered(function () {
    //add your statement here
    this.spreadsheetController.initialize(
        FlowRouter.current().queryParams.spreadsheetId,
        document.getElementById('spreadsheetContent'), this
    )
});

Template.spreadsheetContent.onDestroyed(function () {
    //add your statement here
    this.spreadsheetController.destroy(document.getElementById('spreadsheetContent'))
});

