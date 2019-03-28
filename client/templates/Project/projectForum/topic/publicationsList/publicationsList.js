import projectController from "/client/lib/controllers/projectController";
import Publication from "/imports/classes/Publication";
import cryptoTools from "/client/lib/cryptoTools";
Template.publicationsList.helpers({
    //add you helpers here
    publications: function () {
        return Template.instance().publications.get()
    },
    isWaiting: function () {
        return Template.instance().isWaiting.get()
    },
    hasMore: function () {
        let topic= Template.currentData().topic
        return topic.publicationTotalCount> Template.instance().limit.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    }
});

Template.publicationsList.events({
    //add your events here
    'click [showMore]': function (event, instance) {
        instance.limit.set(instance.limit.get()+10)
    }
});

Template.publicationsList.onCreated(function () {
    //add your statement here
    this.publications = new ReactiveVar()
    this.limit = new ReactiveVar(5)
    this.isWaiting = new ReactiveVar(true)
    Tracker.autorun(() => {
        FlowRouter.watchPathChange()
        let topicId = this.data.topic._id
        let projectId = FlowRouter.current().params.projectId
        this.isWaiting.set(true)
        Meteor.subscribe("publications", projectController.getAuthInfo(projectId), topicId,  projectId,this.limit.get(),err => {
            if (err) {
                console.log(err)
            } else {

            }
        })
        Tracker.autorun(()=>{
            this.publications.set(Publication.find({topicId: topicId},{sort: {
                    createdAt: -1
                }}).fetch())
            this.isWaiting.set(false)
            this.data.refreshScrollbar()
        })
    })
});

Template.publicationsList.onRendered(function () {
    //add your statement here
});

Template.publicationsList.onDestroyed(function () {
    //add your statement here
});

