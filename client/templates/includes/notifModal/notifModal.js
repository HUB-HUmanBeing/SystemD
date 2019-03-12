import ProjectNotifications from "../../../../lib/collections/ProjectNotifications";
import ProjectNotification from "../../../../imports/classes/ProjectNotification";

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
});

