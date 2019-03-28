import Project from "../../../../imports/classes/Project";
import cryptoTools from "../../../lib/cryptoTools";
import BeautifyScrollbar from 'beautify-scrollbar';
import Publication from "../../../../imports/classes/Publication";

Template.projectForum.helpers({
    //add you helpers here
    currentProject: function () {

        return Template.instance().currentProject.get()

    },
    categories: function () {

        let instance = Template.instance()
        Meteor.setTimeout(() => {
            let categoryListContainer = document.getElementById('categoryListContainer')
            if (categoryListContainer && instance && Meteor.Device.isDesktop()) {
                if (instance.categorybs) {
                    instance.categorybs.destroy()
                }
                instance.categorybs = new BeautifyScrollbar('#categoryListContainer');
            }
        }, 700)
        return instance.categories.get()
    },
    showTopic: function () {

        FlowRouter.watchPathChange()
        let instance = Template.instance()
        Meteor.setTimeout(() => {
            let topicContainer = document.getElementById('topicContainer')
            if (topicContainer && instance && Meteor.Device.isDesktop()) {
                if (instance.topicbs) {
                    instance.topicbs.destroy()
                }
                instance.topicbs = new BeautifyScrollbar('#topicContainer');
            }
        }, 700)

        return Meteor.Device.isDesktop() || !!FlowRouter.current().queryParams.topicId
    },
    showCategories: function () {
        FlowRouter.watchPathChange()
        return Meteor.Device.isDesktop() || !FlowRouter.current().queryParams.topicId
    },
    refreshScrollbar: function () {
        let instance = Template.instance()
        return function () {
            Meteor.setTimeout(() => {
                let topicContainer = document.getElementById('topicContainer')
                if (topicContainer && instance && Meteor.Device.isDesktop()) {
                    if (instance.topicbs) {
                        instance.topicbs.destroy()
                    }
                    instance.topicbs = new BeautifyScrollbar('#topicContainer');
                }
            }, 200)
        }
    }
});

Template.projectForum.events({
    //add your events here
});

Template.projectForum.onCreated(function () {
    //add your statement here
    this.categorybs = undefined
    this.topicbs = undefined
    this.projectId = FlowRouter.current().params.projectId
    this.categories = new ReactiveVar([])
    this.currentProject = new ReactiveVar()
    Tracker.autorun(() => {
        this.currentProject.set(Project.findOne(this.projectId))
        if (this.currentProject.get()) {
            let encryptedCategories = this.currentProject.get().private.forumCategories;
            let symKey = Session.get("currentProjectSimKey")
            if (encryptedCategories.length && symKey) {
                cryptoTools.decryptArrayOfObject(encryptedCategories, {symKey: symKey}, (decryptedCategories) => {
                    this.categories.set(decryptedCategories)
                })
            }
        }


    })
});

Template.projectForum.onRendered(function () {
    //add your statement here
});

Template.projectForum.onDestroyed(function () {
    //add your statement here
    if (this.categorybs) {
        this.categorybs.destroy()
    }
    if (this.topicbs) {
        this.topicbs.destroy()
    }
});

