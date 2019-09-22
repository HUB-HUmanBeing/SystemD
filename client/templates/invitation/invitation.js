import inviteController from "../../lib/controllers/inviteController";
import Project from "../../../imports/classes/Project";
import hubCrypto from "../../lib/hubCrypto";

Template.invitation.helpers({
    //add you helpers here
    invitation: function () {
        return Template.instance().invitation.get()
    },
    project: function () {
        return Template.instance().project.get()
    },
    userAlreadyInProject: function () {
        let result= false
        if(Session.get("projects")){
            Session.get("projects").forEach(userProject=>{
                if(userProject.asymEnc_projectId === Template.instance().project.get()._id){
                    result = true
                }
            })
        }

        return result
    },
    ready:function(){
        return !Meteor.userId() || !!Session.get("projects")
    },
    noLongerExist: function () {
        return Template.instance().noLongerExist.get()
    },
    needToLoginFirst: function () {
        return Template.instance().needToLoginFirst.get()
    }
});

Template.invitation.events({
    //add your events here
    "click [accept]" :function (event, instance) {
        event.preventDefault()
        if(Meteor.userId()){
            inviteController.acceptInvitation(instance.invitation.get(), instance.project.get(), instance.password, ()=>{
                hubCrypto.decryptAndStoreProjectListInSession(()=>{
                    FlowRouter.go('/project/'+instance.project.get()._id+'/forum')
                })

            })
        }else{
            instance.needToLoginFirst.set(true)
        }
    },
    "click [goLogin]" : function (event, instance) {
        event.preventDefault()
        FlowRouter.go('/login', null,{invitationId: instance.invitationId, password: instance.password})
    }
});

Template.invitation.onCreated(function () {
    //add your statement here
    this.invitation = new ReactiveVar()
    this.project = new ReactiveVar()
    this.noLongerExist = new ReactiveVar(false)
    this.invitationId = FlowRouter.current().params.invitationId
    this.password = FlowRouter.current().queryParams.password
    this.needToLoginFirst = new ReactiveVar(false)
    //on récupere notre invit et notre projet grace au controlleur
    inviteController.getCurrentInvitAndProject(this.invitationId, this.password,(invitation, project) => {
        if(invitation){
            this.invitation.set(invitation)
            this.project.set(project)
        }else{
            this.noLongerExist.set(true)
        }


    })

});

Template.invitation.onRendered(function () {
    //add your statement here
});

Template.invitation.onDestroyed(function () {
    //add your statement here
});

