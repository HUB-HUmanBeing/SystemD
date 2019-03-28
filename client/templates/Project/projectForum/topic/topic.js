import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Topic from "/imports/classes/Topic";
import Project from "../../../../../imports/classes/Project";

Template.topic.helpers({
    //add you helpers here
    currentTopic: function () {

        return Template.instance().currentTopic.get()
    },
    isRefreshing: function () {
        return Template.instance().isRefreshing.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    }
});

Template.topic.events({
    //add your events here
});

Template.topic.onCreated(function () {
    //add your statement here
    this.currentTopic = new ReactiveVar()
    this.isRefreshing = new ReactiveVar(true)
    let currentProject = Project.findOne(FlowRouter.current().params.projectId)
    Tracker.autorun(() => {
        this.isRefreshing.set(true)
        FlowRouter.watchPathChange()
        let topicId = FlowRouter.current().queryParams.topicId || currentProject.private.mainTopicId
        let projectId = FlowRouter.current().params.projectId
        Meteor.subscribe("singleTopic", projectController.getAuthInfo(projectId), topicId, projectId, err => {
            if (err) {
                console.log(err)
            } else {
                Tracker.autorun(() => {
                    let encryptedTopic = Topic.findOne({_id: topicId})
                    if (encryptedTopic.isMainTopic) {
                        this.currentTopic.set(encryptedTopic)
                        this.isRefreshing.set(false)
                    } else {
                        cryptoTools.decryptObject(encryptedTopic, {symKey: Session.get("currentProjectSimKey")}, (topic) => {
                            this.currentTopic.set(topic)
                            this.isRefreshing.set(false)
                        })
                    }
                })


            }
        })
    })
});

Template.topic.onRendered(function () {
    //add your statement here
});

Template.topic.onDestroyed(function () {
    //add your statement here
});

