import cryptoTools from "../../../../../../lib/cryptoTools";
import Publication from "../../../../../../../imports/classes/Publication";
import projectController from "../../../../../../lib/controllers/projectController";
import {renderShortname, unicodeToShortnames} from "emojitsu";
import preFormatMessage from "../../../../../../lib/preformatMessages";
import projectFilesController from "../../../../../../lib/projectFilesController"

Template.fileContent.helpers({
    //add you helpers here

    isCreating: function () {
        return Template.instance().isCreating.get()
    },
    files: function () {
        return Template.instance().files.get()
    },
    fileLoading: function () {
        let files = Template.instance().files.get()
        let loading=false
        files.forEach(file=>{
            if(file.status == "loading"){
                loading=true
            }
        })
        return loading
    }
});

Template.fileContent.events({
    //add your events here

    'submit [newPublicationForm]': function (event, instance) {
        event.preventDefault()
        instance.isCreating.set(true)
        let textContent = preFormatMessage($('#newPublicationText').val())
        let topic = instance.data.topic
        let filesId = []
        instance.files.get().forEach((file)=>{
            if(file.id){
                filesId.push(file.id)
            }
        })
        cryptoTools.sim_encrypt_data(textContent, Session.get("currentProjectSimKey"), (symEnc_text) => {
            let publicationParams = {
                type: "fileContent",
                fileContent: {
                    symEnc_text: symEnc_text,
                    projectFileIds: filesId
                }
            }
            let newPublication = new Publication()
            instance.files.set([])
            newPublication.callMethod(
                "newPublicationFile",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                topic._id,
                publicationParams,
                instance.data.notifyObjects,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        instance.data.reset()
                        instance.isCreating.set(false)
                    }
                }
            )
        })
    },
    'click [fileUploader]': function (event, instance) {
        $('#fileInput').click()
    },
    'change [fileInput]':function (event,instance) {
        projectFilesController.encryptAndUploadFiles(event.currentTarget.files, FlowRouter.current().params.projectId, instance, null,(err)=>{
            if(err){
                Materialize.toast(err, 6000, 'toastError')
            }
        })
    },
    'click [deleteFile]':function (event, instance) {
        event.preventDefault()
        let tempId = event.currentTarget.id.split('-')[1]
        projectFilesController.delete(tempId,instance)
    }

});

Template.fileContent.onCreated(function () {
    //add your statement here
    this.isCreating = new ReactiveVar(false)
    this.files= new ReactiveVar([])
    this.projectId = FlowRouter.current().params.projectId
});

Template.fileContent.onRendered(function () {
    //add your statement here
let dropContainer = $('.fileUploader')[0]
    dropContainer.ondragover = function(evt) {
        evt.preventDefault();
    };
    let counter = 0
    dropContainer.ondragenter = function(evt) {
        event.preventDefault()
        if (counter === 0) {
            $(this).css("opacity", 0.9).css("border", " 2px solid white")
        }
        counter++

    }
    dropContainer.ondragleave = function(evt){
        counter--
        if (counter === 0) {
            $(this).css("opacity", 0.5).css("border", " 2px dashed white")
        }

    }

    dropContainer.ondrop = (evt)=> {
        evt.preventDefault();
        // pretty simple -- but not for IE :(
        let fileInput = evt.dataTransfer.files;
        projectFilesController.encryptAndUploadFiles(fileInput, FlowRouter.current().params.projectId, this, null,)
        $('.fileUploader').css("opacity", 0.5).css("border", " 2px dashed white")

    };
});

Template.fileContent.onDestroyed(function () {
    //add your statement here
    this.files.get().forEach(file=>{
        projectFilesController.delete(file.tempId,this )
    })
});

