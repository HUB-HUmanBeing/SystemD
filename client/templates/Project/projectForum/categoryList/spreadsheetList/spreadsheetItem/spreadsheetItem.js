import projectController from "../../../../../../lib/controllers/projectController";
import Project from "../../../../../../../imports/classes/Project";

Template.spreadsheetItem.helpers({
    //add you helpers here
    isCurrentSpreadsheet: function () {
        FlowRouter.watchPathChange()
        if(Template.currentData().isPad){
            return Template.currentData().spreadsheet._id === FlowRouter.current().queryParams.padId
        }else{
            return Template.currentData().spreadsheet._id === FlowRouter.current().queryParams.spreadsheetId
        }
    },
    isDraggable: function () {
        let projectId = FlowRouter.current().params.projectId
        let isCreator = Template.currentData().spreadsheet.createdBy === projectController.getCurrentUserProject(projectId).memberId
        return (projectController.isAdmin(projectId) || isCreator)
    },
    isDragged: function () {
        return Template.instance().isDrag.get()
    },
});

Template.spreadsheetItem.events({
    //add your events here
});

Template.spreadsheetItem.onCreated(function () {
    //add your statement here
    this.isDrag = new ReactiveVar(false)
});

Template.spreadsheetItem.onRendered(function () {
    //add your statement here
    resetTooltips()
    if (projectController.isAdmin(FlowRouter.current().params.projectId)) {
        let item = document.getElementById(  (this.data.isPad ? "padItem-":"spreadsheetItem-") + this.data.spreadsheet._id)
        let itemDragged =JSON.parse(JSON.stringify(this.data.spreadsheet))
        itemDragged.type =this.data.isPad ? "pad":"spreadsheet"
        item.ondragstart = (event) => {
            this.isDrag.set(true)
            $('.tooltipped').tooltip('remove')
            Session.set("draggedTopicItem", itemDragged)
        }
        item.ondragend = (event) => {
            event.preventDefault()

            Session.set("draggedTopicItem", null)
            this.isDrag.set(false)
            resetTooltips()
        }
    }
});

Template.spreadsheetItem.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

