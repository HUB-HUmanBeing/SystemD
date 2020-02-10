import cryptoTools from "../../../../../lib/cryptoTools";

Template.itemCommentItem.helpers({
   decryptedContent: function() {
       return Template.instance().decryptedContent.get()
   }
});

Template.itemCommentItem.events({

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

