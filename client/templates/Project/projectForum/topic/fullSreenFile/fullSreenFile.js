import filesTypes from "../../../../../lib/filesTypes";
import projectFilesController from "../../../../../lib/projectFilesController";

Template.fullSreenFile.helpers({
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

Template.fullSreenFile.events({
    //add your events here
    "click [closeFullScreenView]": function (event, instance) {
        event.preventDefault()
        resetTooltips()
        Session.set('fullSizeFile', false)
    },
    "click [deleteFile]": function (event, instance) {
        event.preventDefault()
        projectFilesController.deleteSaved(Session.get('fullSizeFile')._id, () => {
            Session.set('fullSizeFile', false)
        })
    }
});

Template.fullSreenFile.onCreated(function () {
    //add your statement here
});

Template.fullSreenFile.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.fullSreenFile.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

