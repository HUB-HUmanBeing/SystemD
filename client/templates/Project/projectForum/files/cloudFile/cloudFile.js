import cryptoTools from "../../../../../lib/cryptoTools";
import projectFilesController from "../../../../../lib/projectFilesController";

Template.cloudFile.helpers({
    //add you helpers here
    decryptedFile : function () {
        return Template.instance().decrypted.get()
    }
});

Template.cloudFile.events({
    //add your events here
    "click [showWide]": function (event, instance) {
        event.preventDefault()
        Session.set('fullSizeFile', "waiting")
        let file = instance.decrypted.get()
        projectFilesController.getFile(file, (res) => {
            file.showWideUrl = res
            Session.set('fullSizeFile', file)

        })
    }
});

Template.cloudFile.onCreated(function () {
    //add your statement here
    this.decrypted = new ReactiveVar({})
    this.autorun(()=>{
        let file= Template.currentData().file
        cryptoTools.decryptObject(file, {symKey: Session.get("currentProjectSimKey")}, (decryptedContent) => {
          this.decrypted.set(decryptedContent)
        })
    })
});

Template.cloudFile.onRendered(function () {
    //add your statement here
});

Template.cloudFile.onDestroyed(function () {
    //add your statement here
});

