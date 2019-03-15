Template.showAcceptNotif.helpers({
    //add you helpers here
});

Template.showAcceptNotif.events({
    //add your events here
    'click [close]':function (event, instance) {
        event.preventDefault()
        Session.set("showAcceptNotif", false)
    }
});

Template.showAcceptNotif.onCreated(function () {
    //add your statement here
});

Template.showAcceptNotif.onRendered(function () {
    //add your statement here
});

Template.showAcceptNotif.onDestroyed(function () {
    //add your statement here
});

