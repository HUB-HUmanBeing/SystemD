import padController from "../../../../../lib/controllers/padController";

Template.padContent.helpers({
    //add you helpers here
    saveSatus: function (){
        let needToSave = Template.currentData().needToSave
        Meteor.setTimeout(()=>{
            resetTooltips()
        },100)
        if(needToSave){
            Template.instance().saved = true
            return "saving"

        }else{
            if(Template.instance().saved == true){
                return "saved"
            }else{
                return false
            }
        }
    }
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
    this.saved = false
    this.padController.initialize(
        FlowRouter.current().queryParams.padId,
        this.data.padInstance
    )
    this.pad = this.padController.pad
});

Template.padContent.onDestroyed(function () {
    //add your statement here

    this.padController.quitEdition()
});

