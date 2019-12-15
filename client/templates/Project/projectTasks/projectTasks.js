import Project from "../../../../imports/classes/Project";
import projectController from "../../../lib/controllers/projectController";
import cryptoTools from "../../../lib/cryptoTools";
import mapParams from "../../../lib/controllers/mapParams";
import Activity from "../../../../imports/classes/Activity";

Template.projectTasks.helpers({
    //add you helpers here
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    sideNav: function () {
        FlowRouter.watchPathChange()
        Template.instance().lastChange.set(Date.now())
        return FlowRouter.current().queryParams.side
    },
    sideNavData: function () {
        return {
            project: Project.findOne(FlowRouter.current().params.projectId),
            colorLegend: Template.instance().colorLegend.get()
        }
    },
    colorLegend: function () {
        return Template.instance().colorLegend.get()
    },
    colorSelector: function () {
        return Template.instance().colorSelector.get()
    },
    selectedColors: function () {
        return Template.instance().selectedColors.get()
    },
    colors: function () {
        return mapParams.colors
    },
    showDragover: function () {
        return Session.get("draggedTaskItem")
    },
    myTasks: function () {
      return Template.instance().myTasks.get()
    },
    isChrome: function () {
        return /Chrome/.test(navigator.userAgent)
    }
});

Template.projectTasks.events({
    //add your events here
    "click [closeSideNav]": function (event,instance) {
        event.preventDefault()
        let duration = Date.now() - instance.lastChange.get()
        if(duration> 300){
            FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/tasks")
        }

    },
    "click [colorSelector]": function (event, instance) {
        event.preventDefault()
        instance.colorSelector.set(!instance.colorSelector.get())
    },
    "click [toggleColor]": function (event, instance) {
        event.preventDefault()
        let selectedColors = instance.selectedColors.get()
        let color = Number(event.currentTarget.id.split('-')[1])
        let index = selectedColors.indexOf(color)
        if (index === -1) {
            selectedColors.push(color)
        } else {
            if(selectedColors.length == 7){
                selectedColors = [color]
            }else{
                selectedColors.splice(index, 1)
            }

        }
        instance.selectedColors.set(selectedColors)
    },
    'click [addBtn]': function (event, instance) {
        event.preventDefault()
        let activity = new Activity()
        let projectId = FlowRouter.current().params.projectId
        //instance.createParams.set(activityParams)
        activity.callMethod("newTaskActivity", projectController.getAuthInfo(projectId), projectId, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                FlowRouter.go("/project/" + projectId + '/tasks?side=activityDetail&activityId=' + res)
            }
        })

    },
    'click [next]': function (event, instance) {
        event.preventDefault()
        instance.move(true)
    },
    'click [previous]': function (event, instance) {
        event.preventDefault()
        instance.move(false)
    },
    "click [myTasks]": function (event, instance) {
        event.preventDefault()
        instance.myTasks.set(!instance.myTasks.get())
    },
    "click [goTodo]": function (event, instance) {
        event.preventDefault()
        instance.go("todo")
    },
    "click [goCalendar]": function (event, instance) {
        event.preventDefault()
        instance.go("calendar")
    },
    "click [goWaitingForStatus]": function (event, instance) {
        event.preventDefault()
        instance.go("waiting")
    },
    "click [goDone]": function (event, instance) {
        event.preventDefault()
        instance.go("done")
    }
});

Template.projectTasks.onCreated(function () {
    //add your statement here
    this.myTasks = new ReactiveVar(false)
    this.lastChange = new ReactiveVar(0)
    this.colorLegend = new ReactiveVar([])
    this.colorSelector = new ReactiveVar(false)
    this.selectedColors = new ReactiveVar([0, 1, 2, 3, 4, 5, 6])
    let projectId = FlowRouter.current().params.projectId
    Meteor.subscribe('activitiesProject', projectController.getAuthInfo(projectId), projectId)

    this.autorun(() => {
        FlowRouter.watchPathChange()
        let colorLegends = Project.findOne(FlowRouter.current().params.projectId).private.calendar.symEncArr_colorLegend
        cryptoTools.decryptStringArray(colorLegends, Session.get("currentProjectSimKey"), decryptedCalendarlegend => {
            this.colorLegend.set(decryptedCalendarlegend)
            Meteor.setTimeout(() => {
                resetTooltips()
            }, 200)
        })
    })
    this.move = (isRight) => {
        let $tasksGroupsList = $("#tasksGroupsList")
        let initialPosition = Number($tasksGroupsList.css("left").substring(0, $tasksGroupsList.css("left").length - 2))
        let leftValue = isRight ? (initialPosition - window.innerWidth) : (initialPosition + window.innerWidth)
        leftValue = leftValue % (4 * window.innerWidth)
        if (leftValue > 0) {
            leftValue = -3 * window.innerWidth
        }
        $tasksGroupsList.css("left", leftValue + "px")
    }
    this.go=(type)=>{
        let leftValue=0
        let $tasksGroupsList = $("#tasksGroupsList")
        switch (type) {
            case "todo":
                break
            case "calendar":
                leftValue = -1*window.innerWidth
                break
            case "waiting":
                leftValue = -2*window.innerWidth
                break
            case "done":
                leftValue = -3*window.innerWidth
                break
        }
        $tasksGroupsList.css("left", leftValue + "px")
    }
});

Template.projectTasks.onRendered(function () {
    //add your statement here
    resetTooltips()
    if (Meteor.Device.isPhone()) {
        this.counter1 = 0
        this.autorun(() => {
            if (Session.get("draggedTaskItem")) {
                let dragOverLeft = document.getElementById("dragover-left")
                this.counter1 = 0

                dragOverLeft.ondragenter = (event) => {
                    console.log(this.counter1)
                    event.preventDefault()
                    if (this.counter1 === 0) {

                        $("#dragover-left").css("opacity", 0.6)
                        let todo = () => {
                            this.move(false)
                            this.timout = Meteor.setTimeout(todo, 1300)
                        }
                        this.timout = Meteor.setTimeout(todo, 1000)
                    }
                    this.counter1++

                }
                dragOverLeft.ondragleave = (event) => {
                    this.counter1--
                    if (this.counter1 === 0) {
                        $("#dragover-left").css("opacity", 0.1)
                        if (this.timout) {
                            Meteor.clearTimeout(this.timout)
                        }

                    }

                }
                dragOverLeft.ondragover = (event) => {
                    event.preventDefault()
                }

                let dragOverRight = document.getElementById("dragover-right")
                this.counter2 = 0

                dragOverRight.ondragenter = (event) => {
                    console.log(this.counter1)
                    event.preventDefault()
                    if (this.counter2 === 0) {

                        $("#dragover-right").css("opacity", 0.6)
                        let todo = () => {
                            this.move(true)
                            this.timout = Meteor.setTimeout(todo, 1300)
                        }
                        this.timout = Meteor.setTimeout(todo, 1000)
                    }
                    this.counter2++

                }
                dragOverRight.ondragleave = (event) => {
                    this.counter2--
                    if (this.counter2 === 0) {
                        $("#dragover-right").css("opacity", 0.1)
                        if (this.timout) {
                            Meteor.clearTimeout(this.timout)
                        }

                    }

                }
                dragOverRight.ondragover = (event) => {
                    event.preventDefault()
                }
            }

        })
    }

});

Template.projectTasks.onDestroyed(function () {
    //add your statement here
});

