import ProjectNotifications from "../../../../lib/collections/ProjectNotifications";
import ProjectNotification from "../../../../imports/classes/ProjectNotification";
import BeautifyScrollbar from "beautify-scrollbar";

Template.notifModal.helpers({
    openNotifPannel: function () {
        return (Session.get("showNotifications"))
    },
    //add you helpers here
    notifs: function () {
        let projectId = Session.get("showNotifications").split('#')[1]
        let section = Session.get("showNotifications").split('#')[2]
        let notifs = []
        if (section === "all") {
            notifs = ProjectNotification.find({projectId: projectId}).fetch()
        } else {
            notifs = ProjectNotification.find({
                "$and": [
                    {projectId: projectId},
                    {section: section}]
            }).fetch()
        }
        let instance = Template.instance()
        Meteor.setTimeout(() => {
            if (Meteor.Device.isDesktop() && notifs.length) {
                let notifList = document.getElementById('notif-box')
                if (instance.bs) {
                    instance.bs.destroy()
                }
                instance.bs = new BeautifyScrollbar(notifList);
            }
        }, 200)
        return notifs
    }
});

Template.notifModal.events({
    //add your events here
});

Template.notifModal.onCreated(function () {
    //add your statement here

});

Template.notifModal.onRendered(function () {
    //add your statement here
    this.bs = undefined
    Session.set("showNotifications", false)
    $('#notifModal').modal({
        opacity: 0.3,
        complete: () => {
            Session.set("showNotifications", false)
        }
    });
});

Template.notifModal.onDestroyed(function () {
    //add your statement here
    $('#notifModal').modal('close');
    if (this.bs) {
        this.bs.destroy()
    }
});

