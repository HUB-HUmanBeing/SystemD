Template.projectList.helpers({
    //add you helpers here
    decryptedProjects: function () {
        console.log(Session.get('decryptedProjects'))
        return Session.get('decryptedProjects')
    }
});

Template.projectList.events({
    //add your events here
});

Template.projectList.onCreated(function () {
    //add your statement here
    Tracker.autorun
});

Template.projectList.onRendered(function () {
    //add your statement here
});

Template.projectList.onDestroyed(function () {
    //add your statement here
});

