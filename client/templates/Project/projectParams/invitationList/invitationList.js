import projectController from "../../../../lib/controllers/projectController";
import Invitation from "../../../../../imports/classes/Invitation";
import moment from "moment";

Template.invitationList.helpers({
    //add you helpers here
    invitations : function () {

        let invitationIds = []
        Template.currentData().currentProject.private.invitations.forEach(invit=>{
            invitationIds.push(invit.invitationId)
        })

        let invitations = Invitation.find({"_id":{"$in": invitationIds}}).fetch()
        let modifiedInvitations =[]
        invitations.forEach(invit=>{
                let serverDate = Template.instance().serverDate.get()
                if(serverDate && invit){
                    let elapsingDuration = new moment(invit.createdAt).add(invit.validityDuration, "h").diff( new moment(serverDate))
                    invit.validityDuration = moment.duration(elapsingDuration).humanize()
                }
                modifiedInvitations.push(invit)
        })
        return modifiedInvitations
    }
});

Template.invitationList.events({
    //add your events here
});

Template.invitationList.onCreated(function () {
    //add your statement here
    this.serverDate = new ReactiveVar()
    let project = Template.currentData().currentProject
    Meteor.subscribe("invitationList", projectController.getAuthInfo(project._id), project._id, (err)=>{
        if(err){
            console.log(err)
        }
    })
    Meteor.call("getServerDate",(err,date)=>{
        if(err){
            console.log(err)
        }else{
            this.serverDate.set(date)
        }
    })
});

Template.invitationList.onRendered(function () {
    //add your statement here
});

Template.invitationList.onDestroyed(function () {
    //add your statement here
});

