import filesTypes from "../../../../../../../../lib/filesTypes";
import projectFilesController from "../../../../../../../../lib/projectFilesController";
import Axios from "axios";

Template.filePreview.helpers({
    //add you helpers here
    type: function () {
        let file = Template.currentData().file
        let type = ""
        filesTypes.forEach(fileType => {
            if (fileType.mimes.indexOf(file.symEnc_mimeType) > -1) {
                type = fileType.label

            }
        })
        return type
    },
    showWideUrl: function () {
return Template.instance().showWideUrl.get()
    }

});

Template.filePreview.events({
    //add your events here
    'click [downLoadFile]': function (event, instance) {
        Session.set('fullSizeFile', "waiting")
        let file = Template.currentData().file
        projectFilesController.getFile(file, (res) => {
           file.showWideUrl = res
            Session.set('fullSizeFile', file)

        })
    }
});

Template.filePreview.onCreated(function () {
    //add your statement here
    this.showWideUrl = new ReactiveVar(false)
});

Template.filePreview.onRendered(function () {
    //add your statement here
    let file = Template.currentData().file

    filesTypes.forEach(fileType => {
        if (fileType.mimes.indexOf(file.symEnc_mimeType) > -1) {
            switch (fileType.label) {
                case "image":
                    projectFilesController.getFile(file, (res) => {
                        const img = document.getElementById('img-' + file._id);
                        img.src = res;
                        const btn = document.getElementById('downLoadLink-' + file._id)
                        btn.href = res;
                    })
                    break;
                // case "video":
                //     projectFilesController.getFile(file, (res)=>{
                //         const img = document.getElementById('video-'+file._id);
                //         img.src = res;
                //     })
                //     break;
                // case "audio":
                //     projectFilesController.getFile(file, (res)=>{
                //         const audio = document.getElementById('audio-'+file._id);
                //         audio.src = res;
                //     })
                //     break;
                default:
                    break;

            }
        }
    })

});

Template.filePreview.onDestroyed(function () {
    //add your statement here
});

