import notificationController from "../../../../../lib/controllers/notificationController";
import projectController from "../../../../../lib/controllers/projectController";

Template.newPublication.helpers({
    //add you helpers here
    contentType: function () {
        return [
            {
                type: "textualContent",
                label: __("newPublication.text"),
                icon: "create"
            },
            {
                type: "fileContent",
                label: __("newPublication.files"),
                icon: "insert_drive_file"
            },
            {
                type: "pollContent",
                label: __("newPublication.poll"),
                icon: "list"
            },

        ]
    },
    selectedType: function () {
        return Template.instance().selectedType.get()
    },
    textContent: function () {
        return Template.instance().textContent.get()
    },
    dataContext: function () {
        let instance = Template.instance()
        let reset = () => {
            instance.selectedType.set(false)
            instance.textContent.set("")
        }
        let membersToNotify = Template.currentData().topic.membersToNotify
        return {
            topic: Template.currentData().topic,
            textContent: Template.instance().textContent.get(),
            reset: reset,
            notifyObjects:notificationController.getNotifyObjects(membersToNotify)
        }
    },
});

Template.newPublication.events({
    //add your events here
    'click [selectType]': function (event, instance) {
        let type = event.currentTarget.id.split("-")[1]
        if (instance.selectedType.get()) {
            let textContent = $('#newPublicationText').val()
            if (textContent) {
                instance.textContent.set(textContent)
            }
        }
        instance.selectedType.set(type)
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            resetTooltips()
        }, 200)
    }
});

Template.newPublication.onCreated(function () {
    //add your statement here
    this.selectedType = new ReactiveVar(false)
    this.textContent = new ReactiveVar("")
    this.autorun(() => {
        FlowRouter.watchPathChange()
        this.selectedType.set(false)
        this.textContent.set("")
    })
});

Template.newPublication.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.newPublication.onDestroyed(function () {
    //add your statement here
});

