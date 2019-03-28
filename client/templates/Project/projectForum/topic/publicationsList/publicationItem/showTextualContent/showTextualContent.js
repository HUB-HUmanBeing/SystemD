import cryptoTools from "/client/lib/cryptoTools";

Template.showTextualContent.helpers({
    //add you helpers here
    decryptedContent: function () {
        return Template.instance().decryptedContent.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    }
});

Template.showTextualContent.events({
    //add your events here
});

Template.showTextualContent.onCreated(function () {
    //add your statement here
    this.decryptedContent = new ReactiveVar(null)
    cryptoTools.decryptObject(this.data.content, {symKey: Session.get("currentProjectSimKey")}, (decryptedContent) => {
        this.decryptedContent.set(decryptedContent)
    })

});

Template.showTextualContent.onRendered(function () {
    //add your statement here
});

Template.showTextualContent.onDestroyed(function () {
    //add your statement here
});

