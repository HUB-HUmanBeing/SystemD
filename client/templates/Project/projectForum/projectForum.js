import Project from "../../../../imports/classes/Project";
import cryptoTools from "../../../lib/cryptoTools";
import BeautifyScrollbar from 'beautify-scrollbar';
import Publication from "../../../../imports/classes/Publication";
import Topics from "../../../../lib/collections/Topics";

Template.projectForum.helpers({
    //add you helpers here
    currentProject: function () {

        return Template.instance().currentProject.get()

    },
    categories: function () {
        let instance = Template.instance()
        let resetCategoryScrollbar = ()=>{
            let categoryListContainer = document.getElementById('categoryListContainer')
            if (categoryListContainer && instance && Meteor.Device.isDesktop()) {
                if (instance.categorybs) {
                    instance.categorybs.destroy()
                }
                instance.categorybs = new BeautifyScrollbar('#categoryListContainer');
            }
        }
        Meteor.setTimeout(() => {
           resetCategoryScrollbar()
        }, 700)
        Meteor.setTimeout(() => {
            resetCategoryScrollbar()
        }, 3000)
        Meteor.setTimeout(() => {
            resetCategoryScrollbar()
        }, 8000)
        return instance.categories.get()
    },
    showTopic: function () {

        FlowRouter.watchPathChange()
      return Meteor.Device.isDesktop() || !!FlowRouter.current().queryParams.topicId || !!FlowRouter.current().queryParams.spreadsheetId || !!FlowRouter.current().queryParams.padId
    },
    showFiles: function () {
        FlowRouter.watchPathChange()
        return FlowRouter.current().queryParams.files
    },
    showCategories: function () {
        FlowRouter.watchPathChange()
        return Meteor.Device.isDesktop() || (!FlowRouter.current().queryParams.topicId && !FlowRouter.current().queryParams.files&& !FlowRouter.current().queryParams.spreadsheetId && !FlowRouter.current().queryParams.padId)
    },
    refreshScrollbar: function () {

        let instance = Template.instance()
        return function () {
            Meteor.setTimeout(()=>{
                let top = $('#topicContainer').scrollTop()
                let currentTopicId = FlowRouter.current().queryParams.topicId||"mainTopic"
                if(instance.isRefreshedFirst != currentTopicId ){
                    if(top>0){

                        $('#topicContainer').scrollTop(0)
                    }else{

                        instance.isRefreshedFirst = currentTopicId
                    }
                }
            }, 1000)

        }
    },
    isSpreadsheet: function () {
        FlowRouter.watchPathChange()
        return !!FlowRouter.current().queryParams.spreadsheetId
    },
    isPad: function () {
        FlowRouter.watchPathChange()
        return !!FlowRouter.current().queryParams.padId
    }
});

Template.projectForum.events({
    //add your events here
});

Template.projectForum.onCreated(function () {
    //add your statement here
    this.categorybs = undefined
    this.topicbs = undefined

    this.categories = new ReactiveVar([])
    this.currentProject = new ReactiveVar()
    this.autorun(() => {
        FlowRouter.watchPathChange()
        this.projectId = FlowRouter.current().params.projectId
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

