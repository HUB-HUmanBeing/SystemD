import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Pad from "/imports/classes/Pad";
import Project from "../../../../../imports/classes/Project";
import Pads from "../../../../../lib/collections/Pads";
import 'quill-paste-smart';

Template.pad.helpers({
    //add you helpers here
    currentPad: function () {
        return Template.instance().currentPad.get()
    },
    isRefreshing: function () {
        return Template.instance().isRefreshing.get()
    },
    needToSave: function () {
        return Template.instance().needToSave.get()
    },
    cursors: function () {
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        return Template.instance().cursors.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    refreshRender: function () {
        let instance = Template.instance()
        let currentPad = Template.instance().currentPad.get()
        return ()=>{
            instance.currentPad.set(false)
            Meteor.setTimeout(()=>{
                instance.currentPad.set(currentPad)
            },500)
        }
    },
    padInstance: function (){
        return Template.instance()
    }

});

Template.pad.events({
    //add your events here
});

Template.pad.onCreated(function () {
    //add your statement here
    this.currentPad = new ReactiveVar()
    this.needToSave = new ReactiveVar(false)
    this.cursors = new ReactiveVar([])
    this.isRefreshing = new ReactiveVar(true)


    this.pinnedPublication = new ReactiveVar(false)
    this.autorun(() => {
        this.currentPad.set(false)
        this.isRefreshing.set(true)
        FlowRouter.watchPathChange()
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        if (currentProject) {


            let padId = FlowRouter.current().queryParams.padId
          Meteor.subscribe("singlePad", projectController.getAuthInfo(FlowRouter.current().params.projectId), padId, err => {

                if (err) {
                    console.log(err)
                } else {
                    this.autorun(() => {
                        FlowRouter.watchPathChange()
                   if(padId != FlowRouter.current().queryParams.padId){
                       padId = FlowRouter.current().queryParams.padId
                       this.currentPad.set(false)
                   }
                        let encryptedPad = Pads.findOne({_id: padId})

                            cryptoTools.decryptObject(encryptedPad, {symKey: Session.get("currentProjectSimKey")}, (pad) => {
                                this.currentPad.set(pad)
                                this.isRefreshing.set(false)
                            })


                    })
                }
            })
        }
    })
});

Template.pad.onRendered(function () {
    //add your statement here


});

Template.pad.onDestroyed(function () {
    //add your statement here
});

