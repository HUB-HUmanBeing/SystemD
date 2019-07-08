import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Topic from "/imports/classes/Topic";
import Project from "../../../../../imports/classes/Project";
import filesTypes from "../../../../lib/filesTypes";

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
    },
    file: function () {
        return Session.get('fullSizeFile')
    },

});

Template.topic.events({
    //add your events here
    'click [closeFullScreenView]': function () {
        Session.set('fullSizeFile', false)
    }
});

Template.topic.onCreated(function () {
    //add your statement here
    this.currentTopic = new ReactiveVar()
    this.isRefreshing = new ReactiveVar(true)
    this.projectId = new ReactiveVar(null)
    this.handlerSubscription = null
    this.autorun(() => {
        this.isRefreshing.set(true)
        FlowRouter.watchPathChange()
        if (this.projectId.get() !== FlowRouter.current().params.projectId && this.handlerSubscription) {
            this.handlerSubscription.stop()
        }
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        if (currentProject) {
            let topicId = FlowRouter.current().queryParams.topicId || currentProject.private.mainTopicId
            this.projectId.set(FlowRouter.current().params.projectId)

            this.handlerSubscription = Meteor.subscribe("singleTopic", projectController.getAuthInfo(this.projectId.get()), topicId, this.projectId.get(), err => {

                if (err) {
                    console.log(err)
                } else {
                    this.autorun(() => {
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
        }

    })
});

Template.topic.onRendered(function () {
    //add your statement here
});

Template.topic.onDestroyed(function () {
    //add your statement here
});

