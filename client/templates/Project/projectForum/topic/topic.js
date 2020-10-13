import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Topic from "/imports/classes/Topic";
import Project from "../../../../../imports/classes/Project";
import Publications from "../../../../../lib/collections/Publications";
import Publication from "../../../../../imports/classes/Publication";

Template.topic.helpers({
    //add you helpers here
    currentTopic: function () {

        return Template.instance().currentTopic.get()
    },
    isRefreshing: function () {
       // return Template.instance().isRefreshing.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    file: function () {
        return Session.get('fullSizeFile')

    },
    pinnedPublication: function () {
        return Template.instance().pinnedPublication.get()

    }

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
    this.pinnedPublication = new ReactiveVar(false)
    this.autorun(() => {

        this.isRefreshing.set(true)
        FlowRouter.watchPathChange()
        if (this.projectId.get() !== FlowRouter.current().params.projectId && this.handlerSubscription) {
            this.handlerSubscription.stop()
        }
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        if (currentProject) {

            this.projectId.set(FlowRouter.current().params.projectId)
            let topicId = FlowRouter.current().queryParams.topicId || currentProject.private.mainTopicId
            Meteor.subscribe("pinnedPublication", projectController.getAuthInfo(this.projectId.get()), topicId, err => {

                if (err) {
                    console.log(err)
                } else {
                    this.autorun(()=>{
                        FlowRouter.watchPathChange()
                        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
                        let topicId = FlowRouter.current().queryParams.topicId || currentProject.private.mainTopicId

                        let pinnedPublication = Publication.findOne({
                            $and: [
                                {topicId: topicId},
                                {pinned: true}]
                        })
                        this.pinnedPublication.set(false)
                        Meteor.setTimeout(()=>{
                            this.pinnedPublication.set(pinnedPublication)
                        },200)

                    })
                }

            })
            this.handlerSubscription = Meteor.subscribe("singleTopic", projectController.getAuthInfo(this.projectId.get()), topicId, this.projectId.get(), err => {

                if (err) {
                    console.log(err)
                } else {
                    this.autorun(() => {
                        let encryptedTopic = Topic.findOne({_id: topicId})
                         if (encryptedTopic){
                             if (encryptedTopic.isMainTopic) {
                                 this.currentTopic.set(encryptedTopic)
                                 this.isRefreshing.set(false)
                             } else {
                                 cryptoTools.decryptObject(encryptedTopic, {symKey: Session.get("currentProjectSimKey")}, (topic) => {
                                     this.currentTopic.set(topic)
                                     this.isRefreshing.set(false)
                                 })
                             }
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

