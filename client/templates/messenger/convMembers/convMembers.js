import cryptoTools from "../../../lib/cryptoTools";
import conversationController from "../../../lib/controllers/conversationController";

Template.convMembers.helpers({
    //add you helpers here
    isInvit : function (){
        FlowRouter.watchPathChange()
        return !!FlowRouter.current().queryParams.addMembers

    },
    currentConv: function () {
        return Template.instance().decryptedConv.get()
    },
});

Template.convMembers.events({
    //add your events here
});

Template.convMembers.onCreated(function () {
    //add your statement here

    this.decryptedConv = new ReactiveVar({})

    this.autorun(() => {
        FlowRouter.watchPathChange()
        if (FlowRouter.current().queryParams.convId) {
            cryptoTools.decryptObject(conversationController.getConv(FlowRouter.current().queryParams.convId), {symKey: conversationController.getSimKey(FlowRouter.current().queryParams.convId)}, (decryptedConv) => {
                this.decryptedConv.set(decryptedConv)

            })
        }

    })

});

Template.convMembers.onRendered(function () {
    //add your statement here
});

Template.convMembers.onDestroyed(function () {
    //add your statement here
});

