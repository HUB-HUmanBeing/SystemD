import Project from "../../../../imports/classes/Project";
import cryptoTools from "../../../lib/cryptoTools";
import BeautifyScrollbar from 'beautify-scrollbar';

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
                if (instance.bs) {
                    instance.bs.destroy()
                }
                instance.bs = new BeautifyScrollbar('#categoryListContainer');
                // Meteor.setTimeout(() => {
                //     if (!instance.scrollDone && instance.currentProjectId.get() && $("#menuProject-" + instance.currentProjectId.get()).offset()) {
                //         $('#menuProjectsContainer').animate({
                //             scrollTop: $("#menuProject-" + instance.currentProjectId.get()).offset().top - 160
                //         });
                //         instance.scrollDone = true
                //     }
                //
                // }, 200)

            }
        },700)
        return instance.categories.get()
    },
    showTopic: function () {
        return true
    },
    showCategories: function () {
        return true
    }
});

Template.projectForum.events({
    //add your events here
});

Template.projectForum.onCreated(function () {
    //add your statement here
    this.bs = undefined
    this.projectId = FlowRouter.current().params.projectId
    this.categories = new ReactiveVar([])
    this.currentProject = new ReactiveVar()
    Tracker.autorun(() => {
        this.currentProject.set(Project.findOne(this.projectId))
        let encryptedCategories = this.currentProject.get().private.forumCategories;
        let symKey = Session.get("currentProjectSimKey")
        if (encryptedCategories.length && symKey) {
            cryptoTools.decryptArryOfObject(encryptedCategories, {symKey: symKey}, (decryptedCategories) => {
                this.categories.set(decryptedCategories)
            })
        }

    })
});

Template.projectForum.onRendered(function () {
    //add your statement here
});

Template.projectForum.onDestroyed(function () {
    //add your statement here
    if (this.bs) {
        this.bs.destroy()
    }
});

