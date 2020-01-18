import User from '/imports/classes/User'
import Project from "../../../../../imports/classes/Project";
import ProjectNotification from "../../../../../imports/classes/ProjectNotification";
import projectController from "../../../../lib/controllers/projectController";

Template.notifItem.helpers({
    notifLabel: function () {
        return __("notifItem." + Template.currentData().notif.notifType)
    },
    icon: function () {
        let notif = Template.currentData().notif
        let icon = ""
        switch (notif.section) {
            case "home":
                return "home"
                break
            case "forum":
                return "chat"
                break
            case "calendar":
                return "view_comfy"
                break
            case "tasks":
                return "format_list_bulleted"
                break
            case "maps":
                return "map"
                break
            case "members":
                return "group"
                break
            case "params":
                return "settings"
                break
            default:
                console.log("notif section not found")

        }
    }
});

Template.notifItem.events({
    //au click sur le lien
    "click [redirect]": function (event, instance) {
        $('#notifModal').modal('close')
        //on execute la redirection
        let notif = instance.data.notif
        //on appele la methote de suppression de la notification
        notif.callMethod('deleteNotif', projectController.getAuthInfo(notif.projectId), (err, res) => {
            //s'il y a une erreur, on toast l'erreur
            if (err) {
                console.log(err)
                //Materialize.toast("une erreur s'est produite", 4000, 'red');
            }
        })
        return true
    },
    //add your events here
    "click [deleteNotif]": function (event, instance) {
        //on récupere la nofi concernée
        let notif = instance.data.notif
        //on appele la methote de suppression de la notification
        notif.callMethod('deleteNotif', projectController.getAuthInfo(notif.projectId), (err, res) => {
            //s'il y a une erreur, on toast l'erreur
            if (err) {
                console.log(err)
                //Materialize.toast("une erreur s'est produite", 4000, 'red');
            } else {
                //sinon, on attends un peu,
                Meteor.setTimeout(() => {
                    //si ya pluus de notifs on ferme la modale
                    if (instance.data.notifs.length === 0) {
                        $('#notifModal').modal('close')
                        resetTooltips()
                    }
                }, 200)

            }
        })
    }
});

Template.notifItem.onCreated(function () {

});

Template.notifItem.onRendered(function () {
    resetTooltips()
});

Template.notifItem.onDestroyed(function () {
    //add your statement here
});

