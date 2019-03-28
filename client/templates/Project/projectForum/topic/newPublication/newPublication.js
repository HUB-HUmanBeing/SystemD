Template.newPublication.helpers({
    //add you helpers here
    contentType: function () {
        return [
            {
                type: "textualContent",
                label: __("newPublication.text"),
                icon: "subject"
            },
            {
                type: "imagesContent",
                label: __("newPublication.images"),
                icon: "panorama"
            },
            {
                type: "pollContent",
                label: __("newPublication.poll"),
                icon: "list"
            },
            {
                type: "filesContent",
                label: __("newPublication.files"),
                icon: "insert_drive_file"
            }
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
        let reset = ()=>{
            instance.selectedType.set(false)
            instance.textContent.set("")
        }
        return {
            topic: Template.currentData().topic,
            textContent: Template.instance().textContent.get(),
            reset: reset
        }
    }
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
    Tracker.autorun(()=>{
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

