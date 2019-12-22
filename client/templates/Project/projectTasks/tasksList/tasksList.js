import Activity from "../../../../../imports/classes/Activity";
import cryptoTools from "../../../../lib/cryptoTools";
import BeautifyScrollbar from "beautify-scrollbar";
import Topic from "../../../../../imports/classes/Topic";
import projectController from "../../../../lib/controllers/projectController";

Template.tasksList.helpers({
    //add you helpers here
    tasks: function () {
        return Template.instance().tasks.get()
    },
    isDraggingTopic: function () {
        return Template.instance().isDroppable(Session.get("draggedTaskItem"))
    }
});

Template.tasksList.events({
    //add your events here
});

Template.tasksList.onCreated(function () {
    //add your statement here
    this.bs ={}
    this.refreshTaskScrollbar = () => {
        // let types = ["todo", "calendar", "done", "waiting"]
        // types.forEach(type=>{
        //     let scrollContainer = document.getElementById('scrollContainer-' + type)
        //
        //     if (scrollContainer && Meteor.Device.isDesktop()) {
        //
        //         if (this.bs[type]) {
        //             this.bs[type].destroy()
        //         }
        //         this.bs[type] = new BeautifyScrollbar('#scrollContainer-' + type);
        //     }
        // })

    }
    this.tasks = new ReactiveVar([])
    let type = this.data.type
    this.isDroppable = function (activity) {
        if (activity) {
            let possibilities = ["todo", "calendar", "done"]
            switch (activity.listType) {
                case "todo":
                    possibilities.splice(0, 1)
                    break
                case "calendar":
                    possibilities.splice(1, 1)
                    break
                case "done":
                    possibilities.splice(2, 1)
                    break
                default:
                    break
            }
            if (possibilities.indexOf(type) > -1) {
                return true
            }
        }
    }

    let cursor
    let dateReference = (task) => {
        return task.start || task.lastEditAt || task.createdAt
    }
    this.sortAndSet = function (tasks) {
        tasks.sort((taskA, taskB) => {

            if (dateReference(taskA) > dateReference(taskB)) {//a est inférieur à b selon les critères de tri
                return taskA.start ? 1 : -1
            } else {//a est supérieur à b selon les critères de tri)
                return taskA.start ? -1 : 1;
            }
        })
        this.tasks.set(tasks)

    }
    this.autorun(() => {
        let colorSelector = {"$in": Template.currentData().selectedColors}
        let projectId = FlowRouter.current().params.projectId
        let type = Template.currentData().type
        switch (type) {
            case "todo":
                cursor = {projectId: projectId, start: {$exists: false}, color: colorSelector, done: false}
                break
            case "calendar":
                cursor = {
                    projectId: projectId,
                    $or: [{daysOfWeek: {$exists: true, $ne: []}}, {end: {$gte: new Date()}}],
                    color: colorSelector
                }
                break
            case "waiting":
                cursor = {
                    projectId: projectId,
                    $or: [
                        {daysOfWeek: {$exists: false}},
                        {daysOfWeek: {$size: 0}},
                    ],


                    $and: [{end: {$lte: new Date()}}, {end: {$exists: true}}],
                    color: colorSelector
                }
                break
            case "done":
                cursor = {projectId: projectId, start: {$exists: false}, color: colorSelector, done: true}
                //cursor = {projectId:projectId, start: {"$exists": false}, done: true}
                break
        }
        if (Template.currentData().myTasks) {
            cursor.participants = {$elemMatch: {$eq: projectController.getCurrentMemberId(projectId)}}
        }
        let taskList = Activity.find(cursor).fetch()
        if (taskList.length) {
            cryptoTools.decryptArrayOfObject(taskList, {symKey: Session.get("currentProjectSimKey")}, decryptedActivities => {
                Meteor.setTimeout(() => {
                    this.sortAndSet(decryptedActivities)

                }, 100)
            })
        } else {
            this.tasks.set([])
        }

        Meteor.setTimeout(this.refreshTaskScrollbar, 600)
        Meteor.setTimeout(this.refreshTaskScrollbar, 1600)
        Meteor.setTimeout(this.refreshTaskScrollbar, 5600)
    })
});

Template.tasksList.onRendered(function () {
    //add your statement here
    resetTooltips()
    let scrollContainer = document.getElementById("scrollContainer-" + this.data.type)
    this.counter = 0
    this.autorun(() => {
        if (Session.get("draggedTaskItem")) {
            this.counter = 0
        }
    })
    scrollContainer.ondragenter = (event) => {
        event.preventDefault()
        if (this.counter === 0) {
            $("#scrollContainer-" + this.data.type + " .listDropBasket").css("opacity", 0.9).css("border", " 3px solid white")
        }
        this.counter++

    }
    scrollContainer.ondragleave = (event) => {
        this.counter--
        if (this.counter === 0) {
            $("#scrollContainer-" + this.data.type + " .listDropBasket").css("opacity", 0.5).css("border", " 3px dotted white")
        }

    }
    scrollContainer.ondragover = (event) => {
        event.preventDefault()
    }
    scrollContainer.ondrop = (event) => {
        event.preventDefault()
        let activity = Activity.findOne(Session.get("draggedTaskItem")._id)
        if (this.isDroppable(Session.get("draggedTaskItem"))) {
            if (this.data.type !== "calendar") {
                Session.set("draggedTaskItem", null)
                activity.callMethod(
                    "changeList",
                    projectController.getAuthInfo(FlowRouter.current().params.projectId),
                    this.data.type,
                    (err, res) => {
                        if (err) {
                            console.log(err)
                        }
                    }
                )
            } else {
                Session.set("waitingActivity", activity)
                FlowRouter.go('/project/' + activity.projectId + "/calendar")
                Materialize.toast(__('projectCalendar.setActivityInfo'), 6000, 'toastOk')
            }
        } else {
            Session.set("draggedTaskItem", null)
        }

    }
});

Template.tasksList.onDestroyed(function () {
    //add your statement here
});

