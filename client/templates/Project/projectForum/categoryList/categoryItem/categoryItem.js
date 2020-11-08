import cryptoTools from "../../../../../lib/cryptoTools";
import projectController from "../../../../../lib/controllers/projectController";
import Topic from "../../../../../../imports/classes/Topic";
import Pad from "../../../../../../imports/classes/Pad";
import Spreadsheet from "../../../../../../imports/classes/Spreadsheet";

Template.categoryItem.helpers({
    //add you helpers here
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    isChoosingType: function () {
        return Template.instance().isChoosingType.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    showNewTopic: function () {
        return Template.instance().showNewTopic.get()
    },
    canMoveUp: function () {
        Template.instance().categoryId.set(Template.currentData().category.categoryId)
        return Template.currentData().index > 0
    },
    canMoveDown: function () {
        return Template.currentData().index < Template.currentData().currentProject.private.forumCategories.length - 1
    },
    isMemberNotified: function () {
        let membersToNotify = Template.currentData().category.membersToNotify
        let currentMemberId = projectController.getCurrentUserProject(Template.currentData().currentProject._id).asymEnc_memberId
        return membersToNotify.indexOf(currentMemberId) >= 0
    },
    topics: function () {
        let topics =Template.instance().topics.get().map(el=>{el.elementType = "topic"; return el})
        let pads =Template.instance().pads.get().map(el=>{el.elementType = "pad"; return el})
        let spreadsheets =Template.instance().spreadsheets.get().map(el=>{el.elementType = "spreadsheet"; return el})
        let res =[...spreadsheets,...pads, ...topics]
        return res.sort((a, b) => {
            if (a.lastActivity > b.lastActivity) return -1
            if (a.lastActivity < b.lastActivity) return 1;
            return 0;
        })
    },
    hasMore: function () {
        return Template.instance().topicsLimit.get() < Template.currentData().category.topicCount
    },
    isCurrentCategory: function () {
        FlowRouter.watchPathChange()
        return Template.currentData().category.categoryId === FlowRouter.current().queryParams.categoryId
    },
    isDraggingTopic: function () {
        let draggedTopicItem = Session.get("draggedTopicItem")
        return !!draggedTopicItem && draggedTopicItem.categoryId !== Template.currentData().category.categoryId
    },
    isLoading: function () {
        return Template.instance().isLoading.get()
    },
    isCreating: function () {
        return Template.instance().isCreating.get()
    }
});

Template.categoryItem.events({
    //add your events here
    'click [openSettings]': function (event) {
        event.stopPropagation()
    },
    'click [editName]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#editCategoryName').focus()
            resetTooltips()
        }, 200)
        instance.isEditing.set(true)
    },   'click [closeEditName]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()


            resetTooltips()

        instance.isEditing.set(false)
    },
    'click [showDelete]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#editCategoryName').focus()
            resetTooltips()
        }, 200)
        instance.showDelete.set(true)
    },
    'submit [editCategoryForm]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        let currentProject = instance.data.currentProject
        let categoryName = event.target.editCategoryName.value
        cryptoTools.sim_encrypt_data(categoryName, Session.get("currentProjectSimKey"), (symEnc_categoryName) => {
            currentProject.callMethod("editForumCategoryName", projectController.getAuthInfo(currentProject._id), instance.data.index, symEnc_categoryName, (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    instance.isEditing.set(false)
                    Meteor.setTimeout(() => {
                        resetTooltips()
                    }, 200)
                }
            })
        })
    },
    'click [moveUp]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        currentProject.callMethod("moveForumCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, "up", (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                instance.isEditing.set(false)
                Meteor.setTimeout(() => {
                    resetTooltips()
                }, 200)
            }
        })

    },
    'click [moveDown]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        currentProject.callMethod("moveForumCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, "down", (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                instance.isEditing.set(false)
                Meteor.setTimeout(() => {
                    resetTooltips()
                }, 200)
            }
        })

    },
    'click [delete]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        currentProject.callMethod("deleteForumCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                instance.showDelete.set(false)
                Meteor.setTimeout(() => {
                    resetTooltips()
                    if (instance.data.currentProject.private.forumCategories.length === 0) {
                        window.location.reload()
                    }
                }, 200)
            }
        })

    },
    'click [abortDelete]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
        instance.showDelete.set(false)
    },
    'click [toggleNotifications]': function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        let currentProject = instance.data.currentProject
        currentProject.callMethod("toggleNotifyCategory", projectController.getAuthInfo(currentProject._id), instance.data.index, (err, res) => {
            if (err) {
                Materialize.toast(__('general.error'), 6000, 'toastError')
                console.log(err)
            } else {
                let membersToNotify = instance.data.category.membersToNotify
                let currentMemberId = projectController.getCurrentUserProject(instance.data.currentProject._id).asymEnc_memberId
                let wasNotified = membersToNotify.indexOf(currentMemberId) >= 0
                Materialize.toast(__('categoryItem.' + (wasNotified ? "notifDisabled" : "notifEnabled")), 6000, 'toastOk')

                Meteor.setTimeout(() => {
                    resetTooltips()
                }, 200)
            }
        })
    },
    "click [openNewTopic]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#newTopicName').focus()
            resetTooltips()
        }, 200)
        instance.showNewTopic.set(event.currentTarget.getAttribute("elementType"))
        instance.isChoosingType.set(false)
    },
    "click [closeNewTopic]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#newTopicName').focus()
            resetTooltips()
        }, 200)
        instance.showNewTopic.set(false)
        instance.isChoosingType.set(false)
    },
    "submit [newTopicForm]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        instance.isCreating.set(true)
        $('.tooltipped').tooltip('remove')
        let type = event.currentTarget.getAttribute("elementType")
        let currentProjectId = instance.data.currentProject._id
        if (type == "topic") {
            let topicParmas = {
                projectId: currentProjectId,
                type: "chat",
                categoryId: instance.data.category.categoryId,
                symEnc_name: event.target.newTopicName.value,
            }
            cryptoTools.encryptObject(topicParmas, {symKey: Session.get("currentProjectSimKey")}, (encryptedTopicParams) => {
                let topic = new Topic()
                topic.callMethod('newTopic', projectController.getAuthInfo(currentProjectId), encryptedTopicParams, (err, res) => {
                    if (err) {
                        Materialize.toast(__('general.error'), 6000, 'toastError')
                        console.warn(err)
                    } else {
                        Meteor.setTimeout(() => {
                            resetTooltips()
                        }, 200)
                        instance.showNewTopic.set(false)
                        instance.isCreating.set(false)
                        FlowRouter.go('/project/' + currentProjectId + '/forum/?categoryId=' + instance.data.category.categoryId + '&topicId=' + res)
                    }
                })
            })
        } else {
            let spreadsheetParmas = {
                projectId: currentProjectId,
                categoryId: instance.data.category.categoryId,
                symEnc_name: event.target.newTopicName.value,
            }
            cryptoTools.encryptObject(spreadsheetParmas, {symKey: Session.get("currentProjectSimKey")}, (encryptedSpreadsheetParams) => {
                let instanceToCreate
                if (type == "pad") {
                    instanceToCreate = new Pad()
                } else {
                    instanceToCreate = new Spreadsheet()
                }
                instanceToCreate.callMethod(type == "pad" ? 'newPad' : 'newSpreadsheet', projectController.getAuthInfo(currentProjectId), encryptedSpreadsheetParams, (err, res) => {
                    if (err) {
                        Materialize.toast(__('general.error'), 6000, 'toastError')
                        console.warn(err)
                    } else {
                        Meteor.setTimeout(() => {
                            resetTooltips()
                        }, 200)
                        instance.showNewTopic.set(false)
                        instance.isCreating.set(false)
                        console.log(res)
                        FlowRouter.go('/project/' + currentProjectId + '/forum/?categoryId=' + instance.data.category.categoryId + '&' + (type == "pad" ? "padId" : "spreadsheetId") + '=' + res)
                    }
                })
            })
        }

    },
    'click [showMore]': function (event, instance) {
        event.preventDefault()
        instance.topicsLimit.set(instance.topicsLimit.get() + 5)
    },
    'click [chooseType]': function (event, instance) {
        event.preventDefault()
        instance.isChoosingType.set(true)
        resetTooltips()
    },
});

Template.categoryItem.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.isChoosingType = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
    this.showNewTopic = new ReactiveVar(false)
    this.topics = new ReactiveVar([])
    this.spreadsheets = new ReactiveVar([])
    this.pads = new ReactiveVar([])
    this.isLoading = new ReactiveVar(true)
    this.isCreating = new ReactiveVar(false)
    this.topicsLimit = new ReactiveVar(5)
    this.categoryId = new ReactiveVar(this.data.category.categoryId)

    this.autorun(() => {
        FlowRouter.current().params.projectId
        Meteor.subscribe(
            'topics',
            projectController.getAuthInfo(FlowRouter.current().params.projectId),
            FlowRouter.current().params.projectId,
            this.categoryId.get(),
            this.topicsLimit.get(),
            err => {
                if (err) {
                    console.log(err)
                } else {
                    this.autorun(() => {
                        let encryptedTopics = Topic.find({categoryId: this.categoryId.get()}, {
                            sort: {
                                lastActivity: -1
                            }
                        }).fetch()
                        this.isLoading.set(false)
                        if (encryptedTopics.length) {
                            cryptoTools.decryptArrayOfObject(encryptedTopics, {symKey: Session.get('currentProjectSimKey')}, (topics) => {
                                this.topics.set(topics)
                            })
                        } else {
                            this.topics.set([])
                        }
                    })

                }
            })
           let types= ["pads", "spreadsheets"]
               types.forEach(type => {
            Meteor.subscribe(type == "pads" ? 'pads' : 'spreadsheets',

                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                FlowRouter.current().params.projectId, this.categoryId.get(),
                this.topicsLimit.get(),
                err => {
                    if (err) {
                        console.log(err)
                    } else {
                        this.autorun(() => {
                            let Class = type == "pads" ? Pad : Spreadsheet
                            let encryptedSpreadsheets = Class.find({categoryId: this.categoryId.get()}).fetch()
                            this.isLoading.set(false)
                            if (encryptedSpreadsheets.length) {
                                cryptoTools.decryptArrayOfObject(encryptedSpreadsheets, {symKey: Session.get('currentProjectSimKey')}, (spreadsheets) => {
                                    this[type].set(spreadsheets)
                                })
                            } else {
                                this[type].set([])
                            }
                        })

                    }
                })
        })
    })
});

Template.categoryItem.onRendered(function () {
    //add your statement here
    resetTooltips()
    if (projectController.isAdmin(FlowRouter.current().params.projectId)) {

        let categoryBody = document.getElementById("categoryBody-" + this.data.category.categoryId)
        let counter = 0
        categoryBody.ondragenter = (event) => {
            event.preventDefault()
            if (counter === 0) {
                $("#categoryBody-" + this.data.category.categoryId + " .topicDropBasket").css("opacity", 0.9).css("border", " 3px solid white")
            }
            counter++

        }
        categoryBody.ondragleave = (event) => {
            counter--
            if (counter === 0) {
                $("#categoryBody-" + this.data.category.categoryId + " .topicDropBasket").css("opacity", 0.5).css("border", " 3px dotted white")
            }

        }
        categoryBody.ondragover = (event) => {
            event.preventDefault()
        }
        categoryBody.ondrop = (event) => {
            event.preventDefault()

            let draggedItem = Session.get("draggedTopicItem")
            let itemClass = Topic
            if( draggedItem.type == "pad"){
                 itemClass = Pad
            }else if(draggedItem.type == "spreadsheet"){
                itemClass = Spreadsheet
            }
          let item = itemClass.findOne(draggedItem._id)
            Session.set("draggedTopicItem", null)
            item.callMethod(
                "changeCategory",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                this.data.category.categoryId,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    }
                }
            )
        }
    }
});

Template.categoryItem.onDestroyed(function () {
    //add your statement here
});

