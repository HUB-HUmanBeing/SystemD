import projectController from "../../../../../../lib/controllers/projectController";
import Project from "../../../../../../../imports/classes/Project";

Template.topicItem.helpers({
    //add you helpers here
    icon: function () {
        if (Template.currentData().topic.isMainTopic) {
            return "home"
        }
        switch (Template.currentData().topic.type) {
            case "chat":
                return "chat"
                break
            default:
                return "chat"
        }
    },
    seen: function () {
        let topic = Template.currentData().topic
        let memberId = projectController.getCurrentUserProject(topic.projectId).asymEnc_memberId
        return topic.seenBy.indexOf(memberId) >= 0
    },
    isCurrentTopic: function () {
        FlowRouter.watchPathChange()
        return Template.currentData().topic._id === FlowRouter.current().queryParams.topicId
    },
    isDraggable: function () {
        let projectId = FlowRouter.current().params.projectId
        let isCreator = Template.currentData().topic.createdBy === projectController.getCurrentUserProject(projectId).memberId
        return !Template.currentData().topic.isMainTopic && (projectController.isAdmin(projectId) || isCreator)
    },
    isDragged: function () {
        return Template.instance().isDrag.get()
    },
    topicId: function () {
        if(Template.currentData().topic.isMainTopic){
            return Project.findOne(FlowRouter.current().params.projectId).private.mainTopicId
        }else{
            return Template.currentData().topic._id
        }

    }
});

Template.topicItem.events({
    //add your events here
});

Template.topicItem.onCreated(function () {
    //add your statement here
    this.isDrag = new ReactiveVar(false)
});

Template.topicItem.onRendered(function () {
    //add your statement here
    resetTooltips()
    if (!this.data.topic.isMainTopic && projectController.isAdmin(FlowRouter.current().params.projectId)) {

        let topic = document.getElementById("topicItem-" + this.data.topic._id)
        topic.ondragstart = (event) => {
            this.isDrag.set(true)
            $('.tooltipped').tooltip('remove')
            Session.set("draggedTopicItem", this.data.topic)
        }
        topic.ondragend = (event) => {
            event.preventDefault()
            Session.set("draggedTopicItem", null)
            this.isDrag.set(false)
            resetTooltips()
        }
    }

});

Template.topicItem.onDestroyed(function () {
    //add your statement here
    resetTooltips()
});

