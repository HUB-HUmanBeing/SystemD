import cryptoTools from "../../../../../../../lib/cryptoTools";
import projectController from "../../../../../../../lib/controllers/projectController";
import ProjectFile from "../../../../../../../../imports/classes/ProjectFile";

Template.showFileContent.helpers({
    //add you helpers here
    decryptedContent: function () {
        return Template.instance().decryptedContent.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    files: function () {
        if(Template.instance().files.get().length){
            Meteor.setTimeout(()=>{
                $('.carousel').carousel();

            },200)
        }

        return Template.instance().files.get()
    },
    focusedFile: function () {
        return Template.instance().focusedFile.get()
    }
});

Template.showFileContent.events({
    //add your events here
    'click [focusFile]': function (event, instance) {
        event.preventDefault()
        let index =  event.currentTarget.id.split('-')[1]
        instance.focusedFile.set(instance.files.get()[index])
    }
});

Template.showFileContent.onCreated(function () {
    //add your statement here
    this.focusedFile =  new ReactiveVar({})
    this.decryptedContent = new ReactiveVar(null)
    cryptoTools.decryptObject(this.data.content, {symKey: Session.get("currentProjectSimKey")}, (decryptedContent) => {
        this.decryptedContent.set(decryptedContent)
    })
    this.files = new ReactiveVar([])
    let projectId=FlowRouter.current().params.projectId
    Meteor.subscribe("publicationFiles",projectController.getAuthInfo(projectId), projectId, this.data.content.projectFileIds, (err)=>{
        if(!err){
            let decryptedFiles = []
            this.data.content.projectFileIds.forEach(fileId=>{
                let publicationFile = ProjectFile.findOne(fileId)

                cryptoTools.decryptObject(publicationFile, {symKey: Session.get("currentProjectSimKey")}, (decryptedContent) => {
                    decryptedFiles.push(decryptedContent)
                    if(decryptedFiles.length ===  this.data.content.projectFileIds.length){
                       this.files.set( decryptedFiles)
                        this.focusedFile.set(decryptedFiles[0])
                    }
                })
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

