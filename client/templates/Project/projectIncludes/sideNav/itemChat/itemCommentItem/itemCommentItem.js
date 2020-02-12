import cryptoTools from "../../../../../../lib/cryptoTools";
import projectController from "../../../../../../lib/controllers/projectController";

Template.itemCommentItem.helpers({
    decryptedContent: function() {
        return Template.instance().decryptedContent.get()
    },
    localeDate: function() {
        date=Template.currentData().itemComment.createdAt
        return date.getHours()+":"+date.getMinutes() 
    },
    timeBanner: function() {
        date=Template.currentData().itemComment.createdAt
        now=new Date()
        if (date.getFullYear()!==now.getFullYear() || date.getMonth()!==now.getMonth() ){
            return date.toDateString()
        }else if ( date.getDate() === now.getDate() ) {
            return "Aujourd'hui"
        }else if ( date.getDate() === now.getDate()-1 ) {
            return "Hier"
        }else if ( now.getDate() - date.getDate() <= 6 ) {
            return date.getDay()
        }else {
            return date.toISOString()
        }
    },
    isDeletable: function () {
        return ( projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId === Template.currentData().itemComment.createdBy )
    }
});

Template.itemCommentItem.events({
    'click [deleteComment]': function (event, instance){
        event.preventDefault()
        instance.data.itemComment.callMethod("delete", projectController.getAuthInfo(FlowRouter.current().params.projectId), (err)=>{
            if (err) {
                console.log(err)
            } else {
                Materialize.toast('Le message a été supprimé', 6000, 'toastOk')
            }
        })
    }
});

Template.itemCommentItem.onCreated(function () {
    this.decryptedContent = new ReactiveVar("")
    cryptoTools.sim_decrypt_data(this.data.itemComment.symEnc_content, Session.get("currentProjectSimKey"), decryptedContent => {
        this.decryptedContent.set(decryptedContent)
    })
});

Template.itemCommentItem.onRendered(function () {

});

Template.itemCommentItem.onDestroyed(function () {

});

