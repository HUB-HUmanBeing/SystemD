import cryptoTools from "../../../../../../../lib/cryptoTools";
import projectController from "../../../../../../../lib/controllers/projectController";
import ProjectFile from "../../../../../../../../imports/classes/ProjectFile";
import Publication from "../../../../../../../../imports/classes/Publication";

Template.showFileContent.helpers({
    //add you helpers here
    decryptedContent: function () {
        return Template.instance().decryptedContent.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    files: function () {
        let id= Template.currentData().id
        if(Template.instance().files.get().length && Meteor.Device.isDesktop()){
            Meteor.setTimeout(()=>{

                $('.carousel-'+id).carousel();

            },500)
        }

        return Template.instance().files.get()
    },
    focusedFile: function () {
        return Template.instance().focusedFile.get()
    },
    abortEdition: function () {
        return Template.currentData().abortEdition
    },
});

Template.showFileContent.events({
    //add your events here
    'click .focusFile': function (event, instance) {
        event.preventDefault()
        let index =  event.currentTarget.id.split('-')[1]
        instance.focusedFile.set(instance.files.get()[index])
    }
});

Template.showFileContent.onCreated(function () {
    //add your statement here
    this.focusedFile =  new ReactiveVar({})
    this.decryptedContent = new ReactiveVar(null)
    this.autorun(()=>{
        let  publication = Publication.findOne(this.data.id)
        if (publication){
            cryptoTools.decryptObject(publication.fileContent, {symKey: Session.get("currentProjectSimKey")}, (decryptedContent) => {
                this.decryptedContent.set(decryptedContent)
            })
        }

    })

    this.files = new ReactiveVar([])
    let projectId=FlowRouter.current().params.projectId
    Meteor.subscribe("publicationFiles",projectController.getAuthInfo(projectId), projectId, this.data.content.projectFileIds, (err)=>{
        if(!err){
            let decryptedFiles = []
            this.data.content.projectFileIds.forEach(fileId=>{
                let publicationFile = ProjectFile.findOne(fileId)
                if(publicationFile){
                    cryptoTools.decryptObject(publicationFile, {symKey: Session.get("currentProjectSimKey")}, (decryptedContent) => {
                        decryptedFiles.push(decryptedContent)
                        if(decryptedFiles.length ===  this.data.content.projectFileIds.length){
                            this.files.set( decryptedFiles)
                            this.focusedFile.set(decryptedFiles[0])
                        }
                    })
                }else{
                    decryptedFiles.push({deleted:true, symEnc_mimeType:"deleted",symEnc_fileName: __("showFileContent.deleted")})
                    if(decryptedFiles.length ===  this.data.content.projectFileIds.length){
                        this.files.set( decryptedFiles)
                        this.focusedFile.set(decryptedFiles[0])
                    }
                }


            })

        }else{

        }
    } )


});

Template.showFileContent.onRendered(function () {
    //add your statement here
});

Template.showFileContent.onDestroyed(function () {
    //add your statement here
});

