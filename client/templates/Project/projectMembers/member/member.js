import moment from "../../../../lib/i18nMoment";
import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import User from "../../../../../imports/classes/User";

Template.member.helpers({
    //add you helpers here
    joinAtTs: function () {
        return new Date(Number(Template.currentData().member.symEnc_joinAtTs))
    },
    showParams: function () {
        let isCurrenUser = Template.currentData().member.symEnc_userId === Meteor.userId()
        let memberIsAdmin = Template.currentData().memberIsAdmin
        let currentUserIsAdmin = Template.currentData().currentUserIsAdmin
        return isCurrenUser || (currentUserIsAdmin && !memberIsAdmin)
    },
    promoteUser: function () {
        return Template.instance().promoteUser.get()
    },
    kickUser: function () {
        return Template.instance().kickUser.get()
    },
    quitProject: function () {
        return Template.instance().quitProject.get()
    }
});

Template.member.events({
    //add your events here
    'click [openPromoteUser]': function (event, instance) {
        event.preventDefault()
        instance.promoteUser.set(true)
        instance.kickUser.set(false)
        instance.quitProject.set(false)
    },
    'click [promoteUser]': function (event, instance) {
        event.preventDefault()
        let currentProject = instance.data.currentProject
        let memberId = instance.data.member.memberId
        let userId = instance.data.member.symEnc_userId
        let currentUserProject = projectController.getCurrentUserProject(currentProject._id)
        let adminPassword =  currentUserProject.asymEnc_adminPassword
        Meteor.subscribe('userPublicInfo', userId,(err)=>{
            if(err){
                console.log(err)
            }else{
                let user = User.findOne(userId)
                let clearAsymEncParams={
                    asymEnc_adminPassword: adminPassword,
                    asymEnc_role: "admin"
                }
                cryptoTools.encryptObject(clearAsymEncParams,{publicKey :user.public.asymPublicKey},(asymEncParams)=>{
                    currentProject.callMethod(
                        "promoteMember",
                        projectController.getAuthInfo(currentProject._id),
                        memberId,
                        userId,
                        cryptoTools.hash(memberId +adminPassword),
                        asymEncParams,
                        (err, res) => {
                        if (err) {
                            console.log(err)
                        } else {
                            Materialize.toast(__("member.PromotedSucces"), 6000, "toastOk")
                        }
                    })
                })
            }
        })

    },
    'click [openKickUser]': function (event, instance) {
        event.preventDefault()
        instance.promoteUser.set(false)
        instance.kickUser.set(true)
        instance.quitProject.set(false)
    },
    'click [kickUser]': function (event, instance) {
        event.preventDefault()
        let currentProject = instance.data.currentProject
        let memberId = instance.data.member.memberId
        let userId = instance.data.member.symEnc_userId
        let currentUserProject = projectController.getCurrentUserProject(currentProject._id)
        let adminPassword =  currentUserProject.asymEnc_adminPassword
        currentProject.callMethod(
            "kickMember",
            projectController.getAuthInfo(currentProject._id),
            memberId,
            userId,
            cryptoTools.hash(memberId +adminPassword),
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    Materialize.toast(__("member.removedSucces"), 6000, "toastOk")
                }
            })
    },
    'click [openQuitProject]': function (event, instance) {
        event.preventDefault()
        instance.promoteUser.set(false)
        instance.kickUser.set(false)
        instance.quitProject.set(true)
    },
    'click [quitProject]': function (event, instance) {
        event.preventDefault()
        console.log('kickUser')
    },
    'focusout .memberItem': function (event, instance) {
        instance.promoteUser.set(false)
        instance.kickUser.set(false)
        instance.quitProject.set(false)
    }
});

Template.member.onCreated(function () {
    //add your statement here
    this.promoteUser = new ReactiveVar(false)
    this.kickUser = new ReactiveVar(false)
    this.quitProject = new ReactiveVar(false)

});

Template.member.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.member.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

