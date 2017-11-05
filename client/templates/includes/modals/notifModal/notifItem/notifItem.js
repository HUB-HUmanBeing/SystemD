Template.notifItem.helpers({
    //onrécupere la couleur des notifications a partir d'une deuxieme variable de session
    color : function () {
    return Session.get("formatedNotifsColor")
}
});

Template.notifItem.events({
    //add your events here
    "click [deleteNotif]" : function (event, instance) {
        console.log()
    }
});

Template.notifItem.onCreated(function () {
    //add your statement here
});

Template.notifItem.onRendered(function () {
    //add your statement here
});

Template.notifItem.onDestroyed(function () {
    //add your statement here
});

