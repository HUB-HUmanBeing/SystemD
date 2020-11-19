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
    "dblclick [showWide]": function (event, instance) {
        if(Meteor.Device.isDesktop()) {
            event.preventDefault()
            Session.set('fullSizeFile', "waiting")
            let file = instance.decrypted.get()
            projectFilesController.getFile(file, (res, blob) => {
                file.showWideUrl = res
                Session.set('fullSizeFile', file)
                Meteor.setTimeout(() => {
                    let container = document.querySelector("#fullScreenItem");
                    let demo = wheelzoom(container.querySelectorAll('img'), {
                        zoom: 0.10,
                        maxZoom: -1
                    });
                }, 400)
            })
        }
    },
    "touchstart [showWide]": function (event, instance) {
        if (!Meteor.Device.isDesktop()) {
            instance.touchTimestamp = Date.now()
        }
    },
    "touchend [showWide]": function (event, instance) {
        if (!Meteor.Device.isDesktop()) {
            if (Date.now() - instance.touchTimestamp < 300) {
                Session.set('fullSizeFile', "waiting")
                let file = instance.decrypted.get()
                projectFilesController.getFile(file, (res, blob) => {
                    file.showWideUrl = res
                    Session.set('fullSizeFile', file)
                    Meteor.setTimeout(() => {
                        let container = document.querySelector("#fullScreenItem");
                        let demo = wheelzoom(container.querySelectorAll('img'), {
                            zoom: 0.10,
                            maxZoom: -1
                        });
                    }, 400)
                })

            }else{
                let ref = event.currentTarget.getAttribute("cloudIconRef")
                let selectedItems = instance.data.parentInstance.selectedItems.get()
                if(selectedItems.indexOf(ref) == -1){
                    selectedItems.push(ref)
                }else{
                    selectedItems.splice(selectedItems.indexOf(ref),1)
                }
                instance.data.parentInstance.selectedItems.set(selectedItems)
            }

        }
    },

});

Template.cloudFile.onCreated(function () {
    //add your statement here
    this.decrypted = new ReactiveVar({})
    this.touchTimestamp = 0
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

