import cryptoTools from "/client/lib/cryptoTools";
import Publication from "../../../../../../../../imports/classes/Publication";

Template.showTextualContent.helpers({
    //add you helpers here
    decryptedContent: function () {
        return Template.instance().decryptedContent.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    abortEdition: function () {
        return Template.currentData().abortEdition
    },
});

Template.showTextualContent.events({
    //add your events here
});

Template.showTextualContent.onCreated(function () {
    //add your statement here
    this.decryptedContent = new ReactiveVar(null)
    this.autorun(()=>{
       let  publication = Publication.findOne(this.data.id)
        if (publication) {
            cryptoTools.decryptObject(publication.textualContent, {symKey: Session.get("currentProjectSimKey")}, (decryptedContent) => {
                this.decryptedContent.set(decryptedContent)
            })
        }
    })


});

Template.showTextualContent.onRendered(function () {
    //add your statement here
});

Template.showTextualContent.onDestroyed(function () {
    //add your statement here
});

