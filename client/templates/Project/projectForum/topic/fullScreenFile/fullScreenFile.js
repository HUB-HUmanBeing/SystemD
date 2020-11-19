import filesTypes from "../../../../../lib/filesTypes";
import projectFilesController from "../../../../../lib/projectFilesController";

Template.fullScreenFile.helpers({
    //add you helpers here
    type: function () {
        let file = Session.get('fullSizeFile')
        if (file) {
            let type = ""
            filesTypes.forEach(fileType => {
                if (fileType.mimes.indexOf(file.symEnc_mimeType) > -1) {
                    type = fileType.label

                }
            })
            resetTooltips()
            return type
        }

    },
});

Template.fullScreenFile.events({
    //add your events here
    "click [closeFullScreenView]": function (event, instance) {
        event.preventDefault()
        resetTooltips()
        Session.set('fullSizeFile', false)
    },
    "click [downloadItem]": function (event, instance) {
        if(Meteor.isCordova){
           projectFilesController.saveBlob2File(Session.get('fullSizeFile').symEnc_fileName, window.blobToDownload)
            resetTooltips()
        }else{
            return true
        }

    },
    "click [deleteFile]": function (event, instance) {
        event.preventDefault()
        projectFilesController.deleteSaved(Session.get('fullSizeFile')._id, () => {
            Session.set('fullSizeFile', false)
        })
    }
});

Template.fullScreenFile.onCreated(function () {
    //add your statement here
});

Template.fullScreenFile.onRendered(function () {
    //add your statement here
    resetTooltips()

});

Template.fullScreenFile.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

