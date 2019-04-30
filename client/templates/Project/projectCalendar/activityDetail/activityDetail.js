import cryptoTools from "../../../../lib/cryptoTools";
import projectController from "../../../../lib/controllers/projectController";
import Activity from "../../../../../imports/classes/Activity";
import mapParams from "../../../../lib/controllers/mapParams";
import calendarController from "../../../../lib/controllers/calendarController";

Template.activityDetail.helpers({
    //add you helpers here
    //add you helpers here
    activity: function () {
        let activity = Template.instance().activity.get()
        Meteor.setTimeout(() => {
            if (activity) {
                $('#editActivityDetail').val(activity.symEnc_detail);
                $('#editActivityDetail').trigger('autoresize');
                Materialize.updateTextFields();
            }
        }, 100)

        return activity
    },
    showEditFormButton: function () {
        return Template.instance().showEditFormButton.get()
    },
    editingColor: function () {
        return Template.instance().editingColor.get()
    },
    colors: function () {
        return mapParams.colors
    },
    eventColor: function () {

        return mapParams.colors[Template.instance().activity.get().color]
    }
});

Template.activityDetail.events({
    //add your events here
    //add your events here
    'keyup #EditActivityForm': function (event, instance) {
        instance.showEditFormButton.set(true)
        return true
    },
    'submit [editActivity] ': function (event, instance) {
        event.preventDefault()
        let params = {
            symEnc_title: $('#activityTitle').val(),
            symEnc_detail: $('#editActivityDetail').val()
        }
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        cryptoTools.encryptObject(params, {symKey: Session.get("currentProjectSimKey")}, encryptedParams => {
            activity.callMethod(
                "editActivityTexts",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                encryptedParams,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {

                    }
                })
        })
    },
    'click [deleteActivity]': function (event, instance) {
        event.preventDefault()
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        activity.callMethod(
            "delete",
            projectController.getAuthInfo(activity.projectId),
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    calendarController.closeSideNav()
                }
            })
    },
    'click [editColor]': function (event, instance) {
        event.preventDefault()
        resetTooltips()
        instance.editingColor.set(!instance.editingColor.get())
    },
    'click [selectColor]': function (event, instance) {
        event.preventDefault()
        let color = Number(event.currentTarget.id.split("-")[1])
        let activityId = FlowRouter.current().queryParams.activityId
        let activity = Activity.findOne(activityId)
        activity.callMethod("changeColor", projectController.getAuthInfo(FlowRouter.current().params.projectId), color, err => {
            if (err) {
                console.log(err)
            } else {
                instance.editingColor.set(false)
                resetTooltips()
            }
        })


    },
});

Template.activityDetail.onCreated(function () {
    //add your statement here
    //add your statement here
    this.activity = new ReactiveVar(false)
    this.showEditFormButton = new ReactiveVar(false)
    this.editingColor = new ReactiveVar(false)

    this.autorun(() => {
        FlowRouter.watchPathChange()

        let activityId = FlowRouter.current().queryParams.activityId
        let projectId = FlowRouter.current().params.projectId
        let activity = Activity.findOne(activityId)
        if (activity) {
            cryptoTools.decryptObject(activity, {symKey: Session.get("currentProjectSimKey")}, decryptedObject => {
                this.activity.set(decryptedObject)
                if(!decryptedObject.symEnc_title ){
                    Meteor.setTimeout(()=>{
                        $('#activityTitle').focus()
                    },500)

                }
            })
        }
    })


})


Template.activityDetail.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.activityDetail.onDestroyed(function () {
    //add your statement here
});

