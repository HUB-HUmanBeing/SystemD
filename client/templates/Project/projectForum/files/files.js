import projectController from "../../../../lib/controllers/projectController";
import ProjectFile from "../../../../../imports/classes/ProjectFile";
import cryptoTools from "../../../../lib/cryptoTools";
import Projects from "../../../../../lib/collections/Projects";
import projectFilesController from "../../../../lib/projectFilesController";
import Selectable from "selectable.js"

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
    selectedItems: function () {
        return Template.instance().selectedItems.get()
    },
    contextMenu: function () {
        return Template.instance().contextMenu.get()
    },
    renameItemId: function () {
        return Template.instance().renameItem.get()
    },
    parentFolders: function () {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        if (currentFolderId == "root") {
            return []
        } else {
            let parentFolders = []
            let folders = Template.instance().allFolders.get()

            function getParentFolderFromId(id, current) {
                folders.forEach((folder) => {
                    if (folder.folderId == id) {
                        if (current) {
                            folder.current = true
                        }
                        parentFolders.push(folder)
                        getParentFolderFromId(folder.parentFolderId, false)
                    }
                })
            }

            getParentFolderFromId(currentFolderId, true)
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
    "dblclick [openFolder]": function (event, instance) {
        console.log(event.currentTarget.getAttribute("href"))
        FlowRouter.go(event.currentTarget.getAttribute("href"))
    },
    "click [newFolder]": function (event, instance) {
        event.preventDefault()
        instance.newFolderForm.set(true)
        instance.contextMenu.set(false)
        Meteor.setTimeout(() => {
            $("#newFolderNameInput").focus()

        }, 200)
    },
    "contextmenu .contextmenu img, contextmenu .contextmenu span, contextmenu .filesContainer, click [openContextMenu]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()

        let clickX = event.originalEvent.pageX
        let clickY = event.originalEvent.pageY
        let position = ""
        if (clickX < window.innerWidth / 2) {
            position += "left:" + clickX + "px ;"
        } else {
            position += "right:" + (window.innerWidth - clickX) + "px ;"
        }
        if (clickY < window.innerHeight / 2) {
            position += "top:" + clickY + "px ;"
        } else {
            position += "bottom:" + (window.innerHeight - clickY) + "px ;"
        }

        let cloudIconRef = event.currentTarget.getAttribute("cloudIconRef")
        if (cloudIconRef) {
            let type = cloudIconRef.split("-")[0]
            let id = cloudIconRef.split("-")[1]

            instance.contextMenu.set(
                {
                    position: position,
                    cut: !!cloudIconRef,
                    paste: (type != "file" && instance.selectedItems.get().length > 0),
                    delete: !!cloudIconRef,
                    new: false,
                    rename: (type != "file" && instance.selectedItems.get().length == 0) ? cloudIconRef : false,
                }
            )
        } else {

            instance.contextMenu.set(
                {
                    position: position,
                    cut: !!cloudIconRef,
                    paste: true,
                    delete: !!cloudIconRef,
                    new: true,
                    rename: false,
                }
            )
        }

    },
    "click [closeContextMenu]": function (event, instance) {
        event.preventDefault()
        instance.contextMenu.set(false)
    },
    "click [closeEditMenu]": function (event, instance) {
        event.preventDefault()
        instance.renameItem.set(false)
        instance.newFolderForm.set(false)
    },
    "click [rename]": function (event, instance) {
        event.preventDefault()
        instance.contextMenu.set(false)
        instance.renameItem.set(event.currentTarget.getAttribute("renameItem").split("-")[1])
        Meteor.setTimeout(() => {
            $("#newFolderNameInput").focus()
        }, 200)
    },
    "contextmenu [closeContextMenu]": function (event, instance) {
        event.preventDefault()
        instance.contextMenu.set(false)
    },
    "click [newFile]": function (event, instance) {
        event.preventDefault()
        $("#uploadFile").click()
    },
    "change [uploadFile]": function (event, instance) {
        projectFilesController.encryptAndUploadFiles(
            event.currentTarget.files,
            FlowRouter.current().params.projectId,
            instance, FlowRouter.current().queryParams.currentFolderId || "root",
            (err) => {
                if (err) {
                    Materialize.toast(err, 6000, 'toastError')
                }
            })
    },
    "submit [newFolderForm]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        let currentProject = instance.data.currentProject
        let folderName = event.target.newFolderNameInput.value
        if (!folderName) {
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
    "submit [editFolderForm]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        let currentProject = instance.data.currentProject
        let folderName = event.target.newFolderNameInput.value
        if (!folderName) {
            Meteor.setTimeout(() => {
                $("#newFolderNameInput").focus()
            }, 200)
            return
        }
        let parentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        cryptoTools.sim_encrypt_data(folderName, Session.get("currentProjectSimKey"), (symEnc_name) => {
            currentProject.callMethod("editCloudFolderName", projectController.getAuthInfo(currentProject._id), symEnc_name, instance.renameItem.get(), (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    instance.renameItem.set(false)
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
    this.contextMenu = new ReactiveVar(false)
    this.folders = new ReactiveVar([])
    this.parentFolder = new ReactiveVar(null)
    this.allFolders = new ReactiveVar([])
    let projectId = Template.currentData().currentProject._id
    this.limit = new ReactiveVar(20)
    this.selectedItems = new ReactiveVar([])
    this.copiedItems = new ReactiveVar([])
    this.renameItem = new ReactiveVar(false)

    let onEnd = (e, selected, unselected) => {
        let selectedItems = []
        this.selectable.getSelectedItems().forEach((item) => {
            selectedItems.push(item.node.getAttribute("cloudIconRef"))
        })
        this.selectedItems.set(selectedItems)
    };
    this.selectableStop = ()=>{
        if (this.selectable) {
            this.selectable.off("end", onEnd)
            this.selectable.destroy();
        }
    }
    this.selectableInit = () => {
        this.selectableStop()

        Meteor.setTimeout(() => {
            this.selectable = new Selectable({
                filter: ".cloudFile",
                appendTo: ".filesContainer"
            });

            this.selectable.on("end", onEnd)
        }, 400)

    }

    this.autorun(() => {
        this.selectableStop()
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
        if (folders.length) {
            cryptoTools.decryptArrayOfObject(folders, {symKey: Session.get("currentProjectSimKey")}, decryptedFolders => {
                this.folders.set(decryptedFolders.sort((a, b) => {
                    if (a.createdAt > b.createdAt) return -1
                    if (a.createdAt < b.createdAt) return 1;
                    return 0;
                }))
                this.selectableInit()
            })
        } else {
            this.folders.set([])
        }
        this.newFolderForm.set(false)
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
    })
    this.autorun(() => {
        this.selectableStop()
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        Meteor.subscribe("projectFiles", projectController.getAuthInfo(projectId), projectId, currentFolderId, this.limit.get(), (err) => {
            if (err) {
                console.log(err)
            } else {
                this.selectableInit()
            }
        })

    })
    this.autorun(() => {
        this.selectableStop()
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        let currentProject = Projects.findOne({_id: projectId})
        let folders = []

        if (currentFolderId != "root" && currentProject.private.cloudFolders.length > 0) {
            let parentFolder = null
            let currentFolder = null


            currentProject.private.cloudFolders.forEach((folder) => {
                if (folder.folderId == currentFolderId) {
                    currentFolder = folder

                }
            })
            if (currentFolder.parentFolderId == "root") {
                this.parentFolder.set({
                    symEnc_name: __("categoryList.myFiles"),
                    _id: "root"
                })
            } else {
                currentProject.private.cloudFolders.forEach((folder) => {
                    if (folder.folderId == currentFolder.parentFolderId) {
                        cryptoTools.decryptObject(folder, {symKey: Session.get("currentProjectSimKey")}, deryptedParentFolder => {

                            this.parentFolder.set(deryptedParentFolder)
                        })
                    }
                })
            }


        }
    })

});

Template.files.onRendered(function () {
    //add your statement here
    this.selectableStop()

    let dropContainer = $('.uploadFileZone')[0]
    dropContainer.ondragover = function (evt) {
        evt.preventDefault();
    };
    let counter = 0
    dropContainer.ondragenter = function (evt) {
        evt.preventDefault()
        if (counter === 0) {
            $(this).addClass("dropFile")
        }
        counter++

    }
    dropContainer.ondragleave = function (evt) {
        evt.preventDefault()
        counter--
        if (counter === 0) {
            $(this).removeClass("dropFile")
        }

    }

    dropContainer.ondrop = (evt) => {
        evt.preventDefault();
        // pretty simple -- but not for IE :(
        let fileInput = evt.dataTransfer.files;
        projectFilesController.encryptAndUploadFiles(fileInput, FlowRouter.current().params.projectId, this, FlowRouter.current().queryParams.currentFolderId || "root", null,)
        $('.uploadFileZone').removeClass("dropFile")

    };
});

Template.files.onDestroyed(function () {
    //add your statement here
    this.selectableStop()
});

