import projectController from "../../../../lib/controllers/projectController";
import ProjectFile from "../../../../../imports/classes/ProjectFile";
import cryptoTools from "../../../../lib/cryptoTools";
import Projects from "../../../../../lib/collections/Projects";

Template.files.helpers({
    //add you helpers here
    percentage: function () {
        let currentProject = Template.currentData().currentProject
        return Math.round((currentProject.private.totalFilesSize / Meteor.settings.public.maxFilesSize) * 100)
    },
    files: function () {
        return ProjectFile.find({projectId: Template.currentData().currentProject._id}).fetch()
    },
    file: function () {

        return Session.get('fullSizeFile')
    },
    newFolderForm: function () {
        return Template.instance().newFolderForm.get()
    },
    folders: function () {
        return Template.instance().folders.get()
    },
    parentFolder: function () {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        if (currentFolderId == "root" || Template.instance().allFolders.get().length ==0){
            return false
        }else{
            let parentFolder = null
            let currentFolder = null
            let folders = Template.instance().allFolders.get()

                folders.forEach((folder)=>{
                    if(folder.folderId== currentFolderId){
                        currentFolder =folder

                    }
                })
            if(currentFolder.parentFolderId == "root"){
                return {
                    symEnc_name: __("files.myFiles"),
                    _id: "root"
                }
            }else{
                folders.forEach((folder)=>{
                    if(folder.folderId== currentFolder.parentFolderId){
                        parentFolder =folder
                    }
                })
            }

            console.log(parentFolder)
            return parentFolder
        }
    },
    parentFolders: function () {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        if (currentFolderId == "root"){
            return []
        }else{
            let parentFolders = []
            let folders = Template.instance().allFolders.get()
            function getParentFolderFromId(id){
                folders.forEach((folder)=>{
                    if(folder.folderId== id){
                        parentFolders.push(folder)
                        getParentFolderFromId(folder.parentFolderId)
                    }
                })
            }
            getParentFolderFromId(currentFolderId)
            return parentFolders.reverse()
        }
    }
});

Template.files.events({
    //add your events here
    "click [seeMore]": function (event, instance) {
        event.preventDefault()
        instance.limit.set(instance.limit.get() + 10)
    },
    "click [newFolder]": function (event, instance) {
        event.preventDefault()
        instance.newFolderForm.set(true)
        Meteor.setTimeout(() => {
            $("#newFolderNameInput").focus()

        }, 200)
    },
    "submit [newFolderForm]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        let currentProject = instance.data.currentProject
        let folderName = event.target.newFolderNameInput.value
        if(!folderName){
            Meteor.setTimeout(() => {
                $("#newFolderNameInput").focus()
            }, 200)
            return
        }
        let parentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        cryptoTools.sim_encrypt_data(folderName, Session.get("currentProjectSimKey"), (symEnc_name) => {
            currentProject.callMethod("newCloudFolder", projectController.getAuthInfo(currentProject._id), symEnc_name, cryptoTools.generateId(), parentFolderId, (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    instance.newFolderForm.set(false)
                    Meteor.setTimeout(() => {
                        resetTooltips()
                    }, 200)
                }
            })
        })
    },
});

Template.files.onCreated(function () {
    //add your statement here
    this.newFolderForm = new ReactiveVar(false)
    this.folders = new ReactiveVar([])
    this.allFolders = new ReactiveVar([])
    let projectId = Template.currentData().currentProject._id
    this.limit = new ReactiveVar(20)
    this.autorun(() => {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        let currentProject = Projects.findOne({_id: projectId})
        let folders = []
        currentProject.private.cloudFolders.forEach((folder) => {
            if (folder.parentFolderId == currentFolderId) {
                folders.push(folder)
            }
        })
        cryptoTools.decryptArrayOfObject(currentProject.private.cloudFolders, {symKey: Session.get("currentProjectSimKey")}, decryptedFolders => {
            this.allFolders.set(decryptedFolders)
        })
        if (folders.length){
            cryptoTools.decryptArrayOfObject(folders, {symKey: Session.get("currentProjectSimKey")}, decryptedFolders => {
                this.folders.set(decryptedFolders.sort((a,b)=>{
                    if(a.symEnc_name > b.symEnc_name) return 1
                    if (a.symEnc_name < b.symEnc_name) return -1;
                    return 0;
                }))
            })
        }else{
            this.folders.set([])
        }
        this.newFolderForm.set(false)
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
    })
    this.autorun(() => {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        Meteor.subscribe("projectFiles", projectController.getAuthInfo(projectId), projectId,currentFolderId, this.limit.get(), (err) => {
            if (err) {
                console.log(err)
            } else {

            }
        })

    })
});

Template.files.onRendered(function () {
    //add your statement here
});

Template.files.onDestroyed(function () {
    //add your statement here
});

