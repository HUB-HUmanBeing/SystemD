import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import Activity from "../../../../../../imports/classes/Activity";

Template.checkList.helpers({
    //add you helpers here

    checkItems: function () {

        return Template.instance().checkItems.get()
    },
    refresher: function () {
    Template.instance().items.set(Activity.findOne(Template.currentData().activity._id).checkList)
        return false
}
});

Template.checkList.events({
    //add your events here
    'click [switchCheckList]': function (event, instance) {
        let activity = instance.data.activity
        if (activity.checkList.length) {
            event.preventDefault()
        } else {
            Activity.findOne(activity._id).callMethod("newCheckItem", projectController.getAuthInfo(FlowRouter.current().params.projectId), err => {
                if (err) {
                    console.log(err)
                } else {
                    Meteor.setTimeout(() => {
                        $("#checkInput-0").focus()
                    }, 500)
                }
            })
        }
    },
    'click [removeCheck]':function (event, instance) {
        let activity = instance.data.activity
            event.preventDefault()
       let index = Number(event.currentTarget.id.split('-')[1])
            Activity.findOne(activity._id).callMethod("removeCheckItem", projectController.getAuthInfo(FlowRouter.current().params.projectId),index, err => {
                if (err) {
                    console.log(err)
                }
            })

    },
    'keyup [checkInput]':function (event, instance) {
        if(instance.timeout){
            Meteor.clearTimeout(instance.timeout)
        }
        instance.timeout = Meteor.setTimeout(()=>{
            let activity = instance.data.activity
            event.preventDefault()
            let index = Number(event.currentTarget.id.split('-')[1])
            cryptoTools.sim_encrypt_data(event.currentTarget.value,Session.get("currentProjectSimKey"), encryptedValue=>{
                Activity.findOne(activity._id).callMethod("editCheckItem", projectController.getAuthInfo(FlowRouter.current().params.projectId),index,encryptedValue, err => {
                    if (err) {
                        console.log(err)
                    }
                })
            })

        },500)
    },
    'click [check]':function (event, instance) {
        let activity = instance.data.activity
        event.preventDefault()
        let index = Number(event.currentTarget.id.split('-')[1])
        Activity.findOne(activity._id).callMethod("checkCheckItem", projectController.getAuthInfo(FlowRouter.current().params.projectId),index, err => {
            if (err) {
                console.log(err)
            }
        })

    },
    'click [addCheck]':function (event, instance) {
        let activity = instance.data.activity
        event.preventDefault()
        Activity.findOne(activity._id).callMethod("newCheckItem", projectController.getAuthInfo(FlowRouter.current().params.projectId), err => {
            if (err) {
                console.log(err)
            }else {
                Meteor.setTimeout(() => {
                    $("#checkInput-"+(activity.checkList.length)).focus()
                }, 500)
            }
        })

    },
});

Template.checkList.onCreated(function () {
    //add your statement here
    this.timeout=false
    this.checkItems = new ReactiveVar([])
    this.items= new ReactiveVar(Activity.findOne(this.data.activity._id).checkList)
    this.autorun(()=>{
        let items = this.items.get()
        if(items.length){

            let decryptedCheckItems = []
            items.forEach((item,i)=>{
                cryptoTools.decryptObject(item, {symKey: Session.get("currentProjectSimKey")}, decryptedCheckItem => {
                   decryptedCheckItems[i]=decryptedCheckItem
                })
            })
            Meteor.setTimeout(()=>{
                this.checkItems.set(decryptedCheckItems)
            },200)

        }else{
            this.checkItems.set([])
        }
    })

});

Template.checkList.onRendered(function () {
    //add your statement here
});

Template.checkList.onDestroyed(function () {
    //add your statement here
});

