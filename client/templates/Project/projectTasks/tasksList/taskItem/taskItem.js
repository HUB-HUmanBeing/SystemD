import mapParams from "../../../../../lib/controllers/mapParams";
import projectController from "../../../../../lib/controllers/projectController";

Template.taskItem.helpers({
    //add you helpers here
    taskColor: function () {

        return mapParams.colors[Template.currentData().task.color]
    },
    checked: function () {
        let checked=0
       Template.currentData().task.checkList.forEach(check=>{
            if(check.checked){
                checked++
            }
        })
        return checked
    },
    participating: function(){
        let task= Template.currentData().task
        return task.participants.indexOf(projectController.getCurrentMemberId(task.projectId)) > -1

    },
    selected: function () {
        FlowRouter.watchPathChange()
        return FlowRouter.current().queryParams.activityId === Template.currentData().task._id
    },
    isDrag: function () {
        return Template.instance().isDrag.get()
    }

});

Template.taskItem.events({
    //add your events here
});

Template.taskItem.onCreated(function () {
    //add your statement here
    this.isDrag = new ReactiveVar(false)
});

Template.taskItem.onRendered(function () {
    //add your statement here
    resetTooltips()
    let task = document.getElementById("taskItem-" + Template.currentData().task._id)
    if(task){
        let taskData=Template.currentData().task
        taskData.listType = Template.currentData().type
        task.ondragstart = (event) => {
            this.isDrag.set(true)
            $('.tooltipped').tooltip('remove')
            Session.set("draggedTaskItem", taskData )
        }
        task.ondragend = (event) => {
            event.preventDefault()
            Session.set("draggedTaskItem", null)
            this.isDrag.set(false)
            resetTooltips()
        }
        $('#taskItem-' + Template.currentData().task._id).bind('contextmenu', function(e) {
            return false;
        });
        // document.getElementById('yourElement').oncontextmenu = function(event) {
        //     event.preventDefault();
        //     event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available?
        //     event.stopImmediatePropagation();
        //     return false;
        // };
    }
});

Template.taskItem.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

