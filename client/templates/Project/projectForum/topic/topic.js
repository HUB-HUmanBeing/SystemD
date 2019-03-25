import projectController from "../../../../lib/controllers/projectController";
import cryptoTools from "../../../../lib/cryptoTools";
import Topic from "/imports/classes/Topic";
Template.topic.helpers({
    //add you helpers here
    currentTopic: function () {

        return Template.instance().currentTopic.get()
    }
});

Template.topic.events({
    //add your events here
});

Template.topic.onCreated(function () {
    //add your statement here
    this.currentTopic =  new ReactiveVar()
    Tracker.autorun(()=>{
        FlowRouter.watchPathChange()
        let topicId = FlowRouter.current().queryParams.topicId || "mainTopic"
        let projectId = FlowRouter.current().params.projectId

        Meteor.subscribe("singleTopic", projectController.getAuthInfo(projectId), topicId,projectId, err=>{
            if(err){
                console.log(err)
            }else{
                let selector
                if(topicId === "mainTopic"){
                    selector= {isMainTopic: true}
                }else{
                    selector={_id : topicId}
                }
                Tracker.autorun(()=>{
                    let encryptedTopic = Topic.findOne(selector)
                    if(encryptedTopic.isMainTopic){
                        this.currentTopic.set(encryptedTopic)
                    }else{
                        cryptoTools.decryptObject(encryptedTopic, {symKey:  Session.get("currentProjectSimKey")}, (topic)=>{
                            this.currentTopic.set(topic)

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

