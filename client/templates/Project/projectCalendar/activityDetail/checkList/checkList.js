import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import Activity from "../../../../../../imports/classes/Activity";

Template.checkList.helpers({
    //add you helpers here

    checkItems: function () {

        return Template.instance().checkItems.get()
    },
    refresher: function () {
        if(typeof Activity.findOne(Template.currentData().activity._id) !== "undefined"){
            Template.instance().items.set(Activity.findOne(Template.currentData().activity._id).checkList)
        }
        return false
},
    showSaveBtn: function () {
        return Template.instance().showSaveBtn.get()
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
        instance.showSaveBtn.set(true)
    },
    'submit [saveCheckItems]':function (event, instance) {
        event.preventDefault()
        let activity = Activity.findOne(FlowRouter.current().queryParams.activityId)
        let encryptedValues = []
        instance.checkItems.get().forEach((item, i)=>{
            cryptoTools.sim_encrypt_data($("#checkInput-"+i).val(),Session.get("currentProjectSimKey"), encryptedValue=>{
                encryptedValues.push(encryptedValue)
                if(i == instance.checkItems.get().length-1){
                    activity.callMethod("editCheckItems", projectController.getAuthInfo(FlowRouter.current().params.projectId),encryptedValues, err => {
                        if (err) {
                            console.log(err)
                        }else{
                            instance.showSaveBtn.set(false)
                        }
                    })
                }
            })
        })


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
                }, 600)
            }
        })

    },
});

Template.checkList.onCreated(function () {
    //add your statement here
    this.timeout=false
    this.checkItems = new ReactiveVar([])
    this.items= new ReactiveVar()

    this.showSaveBtn = new ReactiveVar(false)
    this.autorun(()=>{
        FlowRouter.watchPathChange()
        let activity = Activity.findOne(FlowRouter.current().queryParams.activityId)
        if(typeof activity !== "undefined"){
            let items = activity.checkList
            this.items.set(items)
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
        }
    })

});

Template.checkList.onRendered(function () {
    //add your statement here
    Meteor.setTimeout(()=>{
        $(".inputContainer textarea" ).trigger('autoresize');
    },500)

});

Template.checkList.onDestroyed(function () {
    //add your statement here

});

