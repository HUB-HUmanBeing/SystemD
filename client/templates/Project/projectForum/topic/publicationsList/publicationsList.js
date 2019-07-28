import projectController from "/client/lib/controllers/projectController";
import Publication from "/imports/classes/Publication";
import cryptoTools from "/client/lib/cryptoTools";
import Project from "../../../../../../imports/classes/Project";

Template.publicationsList.helpers({
    //add you helpers here
    publications: function () {
        return Template.instance().publications.get()
    },
    isWaiting: function () {
        return Template.instance().isWaiting.get()
    },
    hasMore: function () {
        let topic = Template.currentData().topic
        return topic.publicationTotalCount > Template.instance().limit.get()
    },
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    }
});

Template.publicationsList.events({
    //add your events here
    'click [showMore]': function (event, instance) {
        instance.limit.set(instance.limit.get() + 10)
        instance.isWaiting.set(true)
    }
});

Template.publicationsList.onCreated(function () {
    //add your statement here
    this.publications = new ReactiveVar()
    this.limit = new ReactiveVar(10)
    this.isWaiting = new ReactiveVar(true)
    this.projectId = new ReactiveVar()
    this.handlerSubscription = false
    this.autorun(() => {
        FlowRouter.watchPathChange()
        if (this.projectId.get() !== FlowRouter.current().params.projectId && this.handlerSubscription) {
            this.handlerSubscription.stop()
        }
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        if (currentProject) {
            let topicId = FlowRouter.current().queryParams.topicId || currentProject.private.mainTopicId
            this.projectId.set(FlowRouter.current().params.projectId)
            this.isWaiting.set(true)
            this.handlerSubscription = Meteor.subscribe("publications", projectController.getAuthInfo(this.projectId.get()), topicId, this.projectId.get(), this.limit.get(), err => {
                if (err) {
                    console.log(err)
                } else {
                    this.isWaiting.set(false)
                }
            })
            this.autorun(() => {
                this.publications.set(Publication.find({
                    $and: [
                        {topicId: topicId},
                        {pinned: false}]
                }, {
                    sort: {
                        createdAt: -1
                    }
                }).fetch())

                this.data.refreshScrollbar()
            })
        }

    })
});

Template.publicationsList.onRendered(function () {
    //add your statement here
});

Template.publicationsList.onDestroyed(function () {
    //add your statement here
    this.handlerSubscription.stop()
});

