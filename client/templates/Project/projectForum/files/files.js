import projectController from "../../../../lib/controllers/projectController";
import ProjectFile from "../../../../../imports/classes/ProjectFile";
import cryptoTools from "../../../../lib/cryptoTools";
import Projects from "../../../../../lib/collections/Projects";
import projectFilesController from "../../../../lib/projectFilesController";
import Project from "../../../../../imports/classes/Project";

Template.files.helpers({
    //add you helpers here
    percentage: function () {
        let currentProject = Template.currentData().currentProject
        return Math.round((currentProject.private.totalFilesSize / Meteor.settings.public.maxFilesSize) * 100)
    },
    files: function () {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        if (currentFolderId == "root") {
            currentFolderId = {$in: ["root", null]}
        }
        return ProjectFile.find({
            projectId: Template.currentData().currentProject._id,
            parentFolderId: currentFolderId
        }).fetch()
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
    draggedItems: function () {
        return Template.instance().draggedItems.get()
    },
    itemsToDelete: function () {
        let selectedItems = Template.instance().toDeleteItems.get()
        let res = {folders: 0, files: 0}
        selectedItems.forEach((item => {
            if (item.split('-')[0] == "folder") {
                res.folders++
            } else {
                res.files++
            }
        }))
        return res
    },
    cutedItems: function () {
        return Template.instance().cutedItems.get()
    },
    contextMenu: function () {
        return Template.instance().contextMenu.get()
    },
    renameItemId: function () {
        return Template.instance().renameItem.get()
    },
    mouseSelection: function () {
        return Template.instance().mouseSelection.get()
    },
    parentInstance: function () {
        return Template.instance()
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
    "dblclick [openFolder], touch [openFolder]": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            let href = event.currentTarget.getAttribute("href")
            if (instance.cutedItems.get().indexOf("folder-" + href.split("=")[2]) == -1) {
                FlowRouter.go(event.currentTarget.getAttribute("href"))
            }
        }
    },
    "touchstart .folderItem": function (event, instance) {
        if (!Meteor.Device.isDesktop()) {
            instance.touchTimestamp = Date.now()
        }
    },
    "touchend .folderItem": function (event, instance) {
        if (!Meteor.Device.isDesktop()) {
            let ref = event.currentTarget.getAttribute("cloudIconRef")
            let folderId = ref.split('-')[1]
            if (Date.now() - instance.touchTimestamp < 300) {
                if (ref.split('-')[0] == "folder") {
                    if (instance.cutedItems.get().indexOf(folderId) == -1) {
                        FlowRouter.go("/project/" + instance.data.currentProject._id + "/forum?files=true&currentFolderId=" + folderId)
                    }
                } else {
                    return true
                }

            } else {
                let selectedItems = instance.selectedItems.get()
                if (selectedItems.indexOf(ref) == -1) {
                    selectedItems.push(ref)
                } else {
                    selectedItems.splice(selectedItems.indexOf(ref), 1)
                }
                instance.selectedItems.set(selectedItems)
            }

        }
    },
    "click [newFolder]": function (event, instance) {
        event.preventDefault()
        instance.newFolderForm.set(true)
        instance.contextMenu.set(false)
        Meteor.setTimeout(() => {
            $("#newFolderNameInput").focus()

        }, 200)
    },
    "contextmenu .contextmenu a, contextmenu .contextmenu img, contextmenu .contextmenu span, contextmenu .filesContainer, click [openContextMenu]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()

        if (Meteor.Device.isDesktop() || event.type == 'click') {

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
            let paste = false

            if (cloudIconRef) {
                let type = cloudIconRef.split("-")[0]
                let id = cloudIconRef.split("-")[1]

                if (type != "file" && instance.cutedItems.get().length > 0
                    && instance.selectedItems.get().length <= 1
                    && instance.cutedItems.get().indexOf(cloudIconRef) == -1) {
                    paste = {
                        label: "(" + instance.cutedItems.get().length + ")",
                        ref: cloudIconRef
                    }
                }

                if (instance.selectedItems.get().indexOf(cloudIconRef) == -1) {
                    instance.selectedItems.set([cloudIconRef])
                }


                instance.contextMenu.set(
                    {
                        position: position,
                        cut: type != "folderMenu" ? {
                            label: "(" + instance.selectedItems.get().length + ")",
                            ref: cloudIconRef
                        } : false,
                        paste: paste,
                        delete: type != "folderMenu",
                        new: false,
                        rename: (type == "folder" && instance.selectedItems.get().length == 1) ? cloudIconRef : false,
                    }
                )
            } else {
                instance.selectedItems.set([])
                let paste = false
                if (instance.cutedItems.get().length) {
                    paste = {
                        label: "(" + instance.cutedItems.get().length + ")",
                        ref: "folder-" + (FlowRouter.current().queryParams.currentFolderId ? FlowRouter.current().queryParams.currentFolderId : "root")
                    }
                }
                instance.contextMenu.set(
                    {
                        position: position,
                        cut: false,
                        paste: paste,
                        delete: false,
                        new: true,
                        rename: false,
                    }
                )
            }

        }

    },
    "click [closeContextMenu]": function (event, instance) {
        event.preventDefault()
        instance.contextMenu.set(false)
    },
    "click [rename]": function (event, instance) {
        event.preventDefault()
        instance.contextMenu.set(false)
        instance.renameItem.set(event.currentTarget.getAttribute("renameItem").split("-")[1])
        Meteor.setTimeout(() => {
            $("#editFolderNameInput").focus()
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
    "submit [newFolderForm] , click [closeCreateMenu]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        let currentProject = instance.data.currentProject
        let folderName = $("#newFolderNameInput").val()
        if (!folderName) {
            instance.newFolderForm.set(false)
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
    "submit [editFolderForm], click [closeEditMenu]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        let currentProject = instance.data.currentProject
        let folderName = $("#editFolderNameInput").val()
        if (!folderName) {
            instance.renameItem.set(false)
            instance.newFolderForm.set(false)
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
    "click .fileIcon img, click .fileIcon span": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            let cloudIconRef = event.currentTarget.getAttribute("cloudIconRef")

            event.stopPropagation();
            let selectedItems = instance.selectedItems.get()
            if (event.ctrlKey || event.metaKey) {

                if (selectedItems.indexOf(cloudIconRef) == -1) {
                    selectedItems.push(cloudIconRef)
                } else {
                    selectedItems.splice(selectedItems.indexOf(cloudIconRef), 1)
                }
                instance.selectedItems.set(selectedItems)
            } else if (event.shiftKey) {
                if (selectedItems.length == 0) {
                    instance.selectedItems.set([cloudIconRef])
                } else {
                    let ordenedCloudLabels = []
                    $(".fileIcon").each(function () {
                        ordenedCloudLabels.push(this.getAttribute("cloudIconRef"))
                    })
                    let selectedIndex = ordenedCloudLabels.indexOf(cloudIconRef)
                    ordenedCloudLabels.forEach((presentItem, i) => {
                        selectedItems.forEach(selectedItem => {
                            if ((ordenedCloudLabels.indexOf(selectedItem) <= i && i <= selectedIndex)
                                ||
                                (ordenedCloudLabels.indexOf(selectedItem) >= i && i >= selectedIndex)) {
                                if (selectedItems.indexOf(presentItem) == -1) {
                                    selectedItems.push(presentItem)
                                }
                            }
                        })

                    })
                    instance.selectedItems.set(selectedItems)
                }
            } else {
                instance.selectedItems.set([cloudIconRef])
            }
        }
    },
    "click #topic": function (event, instance) {
        instance.selectedItems.set([])
    },
    "click [cut]": function (event, instance) {

        instance.cutedItems.set(instance.selectedItems.get())
        instance.selectedItems.set([])
        instance.contextMenu.set(false)
    },
    "click [paste]": function (event, instance) {
        instance.contextMenu.set(false)
        let ref = event.currentTarget.getAttribute("ref")
        let parentFolderId = ref ? ref.split("-")[1] : "root"
        let currentProject = instance.data.currentProject

        instance.cutedItems.get().forEach((cutedItem, i) => {
            let type = cutedItem.split("-")[0]
            let id = cutedItem.split("-")[1]

            let callback = (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    if (i == instance.cutedItems.get().length - 1) {
                        instance.cutedItems.set([])
                        instance.selectedItems.set([])
                        Meteor.setTimeout(() => {
                            resetTooltips()
                        }, 200)
                    }
                }
            }

            if (type == "folder") {
                if (instance.isAllowedToPaste(id, parentFolderId)) {
                    currentProject.callMethod("moveFolder", projectController.getAuthInfo(currentProject._id), id, parentFolderId, callback)
                } else {
                    Materialize.toast(__('files.notAllowedToPaste'), 6000, 'toastError')
                }
            } else if (type == "file") {
                let file = ProjectFile.findOne({_id: id})
                file.callMethod("moveFile", projectController.getAuthInfo(currentProject._id), id, parentFolderId, callback)
            }


        })

    },
    "click [delete]": function (event, instance) {
        instance.contextMenu.set(false)
        instance.toDeleteItems.set(instance.selectedItems.get())
        $('#modalConfirmDelete').modal('open')
    },
    "click [cancelDelete]": function (event, instance) {
        $('#modalConfirmDelete').modal('close')
    },
    "click [confirmDelete]": function (event, instance) {
        $('#modalConfirmDelete').modal('close')
        let itemsToDelete = instance.toDeleteItems.get()
        let currentProject = instance.data.currentProject
        itemsToDelete.forEach((item, i) => {
            let type = item.split("-")[0]
            let id = item.split("-")[1]
            let callback = (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    if (i == instance.cutedItems.get().length - 1) {
                        instance.cutedItems.set([])
                        instance.selectedItems.set([])
                        instance.toDeleteItems.set([])
                        Meteor.setTimeout(() => {
                            resetTooltips()
                        }, 200)
                    }
                }
            }
            if (type == "folder") {
                currentProject.callMethod("deleteFolder", projectController.getAuthInfo(currentProject._id), id, callback)
            } else if (type == "file") {
                let file = ProjectFile.findOne({_id: id})
                file.callMethod("deleteProjectFile", projectController.getAuthInfo(currentProject._id), id, callback)
            }

        })
    },
    "dragstart .cloudFile .fileIcon": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            let cloudIconRef = event.currentTarget.getAttribute("cloudIconRef")
            if (instance.mouseSelectionTimout) {
                Meteor.clearTimeout(instance.mouseSelectionTimout)
                instance.mouseSelection.set(false)
            }
            instance.draggedItems.set(instance.selectedItems.get().indexOf(cloudIconRef) == -1 ? [cloudIconRef] : instance.selectedItems.get())
            instance.selectedItems.set([])
            instance.contextMenu.set(false)
        }
    },
    "dragend .folderItem .fileIcon": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            let cloudIconRef = event.currentTarget.getAttribute("cloudIconRef")
            instance.draggedItems.set([])
        }
    },
    "dragover .parentDropFolder ,dragover .folderItem .fileIcon": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            event.preventDefault()
            instance.mouseSelection.set(false)
        }
    },

    "dragenter .parentDropFolder, dragenter .folderItem .fileIcon": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            event.preventDefault()
            if (instance.draggedItems.get().length > 0) {
                let cloudIconRef = event.currentTarget.getAttribute("cloudIconRef")
                instance.dropCounter[cloudIconRef] = instance.dropCounter[cloudIconRef] || 0
                instance.dropCounter[cloudIconRef]++
                if (instance.dropCounter[cloudIconRef] == 1) {

                    if (instance.draggedItems.get().indexOf(cloudIconRef) == -1) {

                        $(event.currentTarget).addClass("droppableFolder")
                    }
                }
            }
        }
    },
    "dragleave  .parentDropFolder, dragleave .folderItem .fileIcon": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            event.preventDefault()
            if (instance.draggedItems.get().length > 0) {
                let cloudIconRef = event.currentTarget.getAttribute("cloudIconRef")
                instance.dropCounter[cloudIconRef]--
                if (instance.dropCounter[cloudIconRef] == 0) {
                    $(event.currentTarget).removeClass("droppableFolder")
                }
            }
        }
    },
    "drop  .parentDropFolder, drop .folderItem .fileIcon": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            event.preventDefault();
            if (instance.draggedItems.get().length > 0) {
                $(event.currentTarget).removeClass("droppableFolder")
                let ref = event.currentTarget.getAttribute("cloudIconRef")
                if (instance.draggedItems.get().indexOf(ref) == -1) {
                    // pretty simple -- but not for IE :(
                    let parentFolderId = ref ? ref.split("-")[1] : "root"
                    let currentProject = instance.data.currentProject

                    instance.draggedItems.get().forEach((draggedItem, i) => {
                        let type = draggedItem.split("-")[0]
                        let id = draggedItem.split("-")[1]

                        let callback = (err, res) => {
                            if (err) {
                                Materialize.toast(__('general.error'), 6000, 'toastError')
                                console.log(err)
                            } else {
                                if (i == instance.draggedItems.get().length - 1) {
                                    instance.draggedItems.set([])
                                    instance.selectedItems.set([])
                                    Meteor.setTimeout(() => {
                                        resetTooltips()
                                    }, 200)
                                }
                            }
                        }
                        if (type == "folder") {
                            if (instance.isAllowedToPaste(id, parentFolderId)) {
                                currentProject.callMethod("moveFolder", projectController.getAuthInfo(currentProject._id), id, parentFolderId, callback)
                            } else {
                                Materialize.toast(__('files.notAllowedToPaste'), 6000, 'toastError')
                            }
                        } else if (type == "file") {
                            let file = ProjectFile.findOne({_id: id})
                            file.callMethod("moveFile", projectController.getAuthInfo(currentProject._id), id, parentFolderId, callback)
                        }
                    })
                }
            }
        }
    },
    "mousedown .cloudFile .fileIcon": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            event.stopPropagation()
            instance.mouseSelection.set(false)
            if (this.mouseSelectionTimout) {
                Meteor.clearTimeout(this.mouseSelectionTimout)
            }
        }
    },
    "mousedown .filesContainer": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            if (instance.draggedItems.get().length == 0) {
                let mouseSelection = instance.mouseSelection.get()
                if (!mouseSelection) {
                    let x = event.clientX
                    let y = event.clientY
                    instance.mouseSelectionTimout = Meteor.setTimeout(() => {
                        instance.mouseSelection.set({
                            start: {
                                x: x,
                                y: y
                            }, current: false,
                        })
                    }, 300)

                }
            }
            true
        }
    },

    "mousemove .filesContainer": function (event, instance) {
        if (Meteor.Device.isDesktop()) {
            if (instance.draggedItems.get().length == 0) {
                let mouseSelection = instance.mouseSelection.get()
                if (mouseSelection) {


                    let x = event.clientX
                    let y = event.clientY
                    let start = mouseSelection.start
                    let left = 0
                    let right = 0
                    let bottom = 0
                    let top = 0
                    if (x < start.x) {
                        left = x
                        right = start.x
                    } else {
                        right = x
                        left = start.x
                    }
                    if (y < start.y) {
                        top = y
                        bottom = start.y
                    } else {
                        top = start.y
                        bottom = y
                    }
                    let current = "top: " + top + "px; bottom: " + (window.innerHeight - bottom) + "px; right: " + (window.innerWidth - right) + "px; left: " + left + "px;"
                    instance.mouseSelection.set({
                        start: start, current: current,
                    })
                }
            }
        }
    },
});

Template.files.onCreated(function () {
    //add your statement here
    this.newFolderForm = new ReactiveVar(false)
    this.contextMenu = new ReactiveVar(false)
    this.folders = new ReactiveVar([])
    this.currentFolder = new ReactiveVar({})
    this.parentFolder = new ReactiveVar(null)
    this.allFolders = new ReactiveVar([])
    let projectId = Template.currentData().currentProject._id
    this.limit = new ReactiveVar(20)
    this.selectedItems = new ReactiveVar([])
    this.draggedItems = new ReactiveVar([])
    this.cutedItems = new ReactiveVar([])
    this.toDeleteItems = new ReactiveVar([])
    this.renameItem = new ReactiveVar(false)
    this.mouseSelection = new ReactiveVar(false)
    this.mouseSelectionTimout = false
    this.touchTimestamp = 0
    this.dropCounter = {}
    this.getFolder = (folderId) => {
        let res = null
        this.allFolders.get().forEach((folder) => {
            if (folder.folderId == folderId) {
                res = folder
            }
        })
        return res
    }
    this.isAllowedToPaste = (idToPaste, folderId) => {

        let parentFolderList = [folderId]
        let checkParent = (id) => {
            if (folderId != "root" && folderId) {
                let folder = this.getFolder(id)

                if (id != "root"){
                    parentFolderList.push(folder.parentFolderId)
                    checkParent(folder.parentFolderId)
                }

            }
        }
        checkParent(folderId)
        return parentFolderList.indexOf(idToPaste) == -1
    }
    this.autorun(() => {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        let currentProject = Project.findOne({_id: projectId})
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
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        Meteor.subscribe("projectFiles", projectController.getAuthInfo(projectId), projectId, currentFolderId, this.limit.get(), (err) => {
            if (err) {
                console.log(err)
            } else {
            }
        })

    })
    this.autorun(() => {
        FlowRouter.watchPathChange()
        let currentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
        let currentProject = Projects.findOne({_id: projectId})
        currentProject = Project.findOne({_id: projectId})
        let folders = []

        if (currentFolderId != "root" && currentProject.private.cloudFolders.length > 0) {
            currentProject.private.cloudFolders.forEach((folder) => {
                if (folder.folderId == currentFolderId) {
                    let currentFolder = folder
                    if (currentFolder) {
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
                }
            })


        }
    })

    this.initializeDropFile = () => {
        if (Meteor.Device.isDesktop()) {
            let draggedItems = this.draggedItems
            let dropContainer = $('.uploadFileZone')[0]
            dropContainer.ondragover = function (evt) {

                evt.preventDefault();

            };
            let counter = 0
            dropContainer.ondragenter = function (evt) {
                evt.preventDefault()
                if (counter === 0) {
                    if (draggedItems.get().length === 0) {
                        $(this).addClass("dropFile")
                    }
                }
                counter++
            }
            dropContainer.ondragleave = function (evt) {
                evt.preventDefault()
                counter--
                if (counter === 0) {
                    if (draggedItems.get().length === 0) {
                        $(this).removeClass("dropFile")
                    }
                }
            }

            dropContainer.ondrop = (evt) => {
                evt.preventDefault();
                if (draggedItems.get().length === 0) {
                    // pretty simple -- but not for IE :(
                    let fileInput = evt.dataTransfer.files;
                    projectFilesController.encryptAndUploadFiles(fileInput, FlowRouter.current().params.projectId, this, FlowRouter.current().queryParams.currentFolderId || "root", null,)
                    $('.uploadFileZone').removeClass("dropFile")
                }
            };
        }
    }
});

Template.files.onRendered(function () {
    //add your statement here
    $('#modalConfirmDelete').modal();
    this.initializeDropFile()
    window.addEventListener('mouseup', event => {
        if (Meteor.Device.isDesktop()) {
            if (this.mouseSelectionTimout) {
                Meteor.clearTimeout(this.mouseSelectionTimout)
            }

            let x = event.clientX
            let y = event.clientY
            let mouseSelection = this.mouseSelection.get()
            if (mouseSelection) {
                this.mouseSelection.set(false)
                let selectedItems = []
                $(".centerPoint").each((index, point) => {
                    if (
                        ((y < point.getBoundingClientRect().top && point.getBoundingClientRect().top < mouseSelection.start.y) ||
                            (mouseSelection.start.y < point.getBoundingClientRect().top && point.getBoundingClientRect().top < y))
                        &&
                        ((x < point.getBoundingClientRect().left && point.getBoundingClientRect().left < mouseSelection.start.x) ||
                            (mouseSelection.start.x < point.getBoundingClientRect().left && point.getBoundingClientRect().left < x))
                    ) {
                        let cloudIconRef = point.getAttribute("cloudIconRef")

                        selectedItems.push(cloudIconRef)
                    }
                })

                Meteor.setTimeout(() => {
                    this.selectedItems.set(selectedItems)
                }, 100)

            }
        }
    });
    window.addEventListener('keydown', e => {
        const ctrlDown = false,
            ctrlKey = 17,
            cmdKey = 91,
            vKey = 86,
            xKey = 88,
            cKey = 67;
        if ((e.ctrlKey || e.metaKey) && (e.keyCode == cKey)) {
            this.cutedItems.set(this.selectedItems.get())
            this.selectedItems.set([])
            this.contextMenu.set(false)
        } else if ((e.ctrlKey || e.metaKey) && (e.keyCode == xKey)) {
            this.cutedItems.set(this.selectedItems.get())
            this.selectedItems.set([])
            this.contextMenu.set(false)
        } else if ((e.ctrlKey || e.metaKey) && (e.keyCode == vKey)) {
            let parentFolderId
            if (this.selectedItems.get().length == 1 && this.selectedItems.get()[0].split("-")[0] == "folder") {
                let ref = this.selectedItems.get()[0]
                parentFolderId = ref ? ref.split("-")[1] : "root"
            } else {
                parentFolderId = FlowRouter.current().queryParams.currentFolderId || "root"
            }
            if (parentFolderId) {
                let currentProject = this.data.currentProject
                this.cutedItems.get().forEach((cutedItem, i) => {
                    let type = cutedItem.split("-")[0]
                    let id = cutedItem.split("-")[1]

                    let callback = (err, res) => {
                        if (err) {
                            Materialize.toast(__('general.error'), 6000, 'toastError')
                            console.log(err)
                        } else {
                            if (i == this.cutedItems.get().length - 1) {
                                this.cutedItems.set([])
                                this.selectedItems.set([])
                                Meteor.setTimeout(() => {
                                    resetTooltips()
                                }, 200)
                            }
                        }
                    }

                    if (type == "folder") {
                        if (this.isAllowedToPaste(id, parentFolderId)) {
                            currentProject.callMethod("moveFolder", projectController.getAuthInfo(currentProject._id), id, parentFolderId, callback)
                        } else {
                            Materialize.toast(__('files.notAllowedToPaste'), 6000, 'toastError')
                        }
                    } else if (type == "file") {
                        let file = new ProjectFile
                        file.callMethod("moveFile", projectController.getAuthInfo(currentProject._id), id, parentFolderId, callback)
                    }
                })
            }
        }


    });
});

Template.files.onDestroyed(function () {
    //add your statement here
});

