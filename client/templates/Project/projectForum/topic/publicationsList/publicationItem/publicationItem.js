import cryptoTools from "/client/lib/cryptoTools";
import projectController from "../../../../../../lib/controllers/projectController";

Template.publicationItem.helpers({
    //add you helpers here
    refreshScrollbar: function () {
        return Template.currentData().refreshScrollbar
    },
    isDeletable: function () {
        return Template.currentData().publication.createdBy === projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_memberId
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    isEditing: function () {
        return Template.instance().isEditing.get()
    },
    abortEdition: function () {
        let instance = Template.instance()
        return function (){
               instance.isEditing.set(false)

        }
    }
});

Template.publicationItem.events({
    //add your events here
    'click [showDelete]': function (event, instance) {
      event.preventDefault()
      instance.showDelete.set(true)
    },
    'click [edit]': function (event, instance) {
      event.preventDefault()
      instance.isEditing.set(true)
    },
    'click [deletePublication]': function (event, instance) {
        event.preventDefault()
        instance.data.publication.callMethod("delete", projectController.getAuthInfo(FlowRouter.current().params.projectId), (err) => {
            if (err) {
                console.log(err)
            } else {
                Materialize.toast(__('publicationItem.deleteSuccess'), 6000, 'toastOk')
            }

        })
    },
    'click [cancelDeletion]': function (event,instance) {
        event.preventDefault()
        instance.showDelete.set(false)
    }
});

Template.publicationItem.onCreated(function () {
    //add your statement here
    this.showDelete = new ReactiveVar(false)
    this.isEditing = new ReactiveVar(false)

});

Template.publicationItem.onRendered(function () {
    //add your statement here
});

Template.publicationItem.onDestroyed(function () {
    //add your statement here
});

