import padController from "../../../../../lib/controllers/padController";

Template.padContent.helpers({
    //add you helpers here
});

Template.padContent.events({
    //add your events here
});

Template.padContent.onCreated(function () {
    //add your statement here
    this.padController = padController
});

Template.padContent.onRendered(function () {
    //add your statement here
    this.padController.initialize(
        FlowRouter.current().queryParams.padId,
        this
    )
    this.pad = this.padController.pad
});

Template.padContent.onDestroyed(function () {
    //add your statement here


});

