import cryptoTools from "../../../lib/cryptoTools";
import conversationController from "../../../lib/controllers/conversationController";

Template.convListItem.helpers({
    //add you helpers here
    decryptedConv: function () {
        return Template.instance().decryptedConv.get()
    },
    members: function () {
        return Template.instance().decryptedMembers.get()
    },
    otherMembers: function () {

        return Template.instance().otherMembers.get()
    },
    name: function () {
        return conversationController.getConvName(Template.instance().decryptedConv.get(),Template.instance().otherMembers.get())

    },
    selected: function (){
        FlowRouter.watchPathChange()
        return FlowRouter.current().queryParams.convId == Template.currentData().conv._id
    }


});

Template.convListItem.events({
    //add your events here
});

Template.convListItem.onCreated(function () {
    //add your statement here
    this.decryptedConv = new ReactiveVar({})
    this.decryptedMembers = new ReactiveVar([])
    this.otherMembers = new ReactiveVar([])
    cryptoTools.decryptObject(this.data.conv, {symKey: conversationController.getSimKey(this.data.conv._id)}, (decryptedConv) => {
        this.decryptedConv.set(decryptedConv)

    })
    cryptoTools.decryptArrayOfObject(this.data.conv.members, {symKey: conversationController.getSimKey(this.data.conv._id)}, (decryptedMembers) => {
        this.decryptedMembers.set(decryptedMembers)
        let otherMembers = []
        decryptedMembers.forEach(convMember => {
            if (convMember.asymEnc_memberId == conversationController.currentUserMemberForConv(this.data.conv._id)) {
                otherMembers.push(convMember)
            }
        })
        this.otherMembers.set(otherMembers)
    })


});

Template.convListItem.onRendered(function () {
    //add your statement here
});

Template.convListItem.onDestroyed(function () {
    //add your statement here
});

