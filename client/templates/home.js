Template.home.helpers({
    // add you helpers here
    isAllowed() {
        let isAdmin = false
        if(Meteor.user()) {
             isAdmin= Meteor.user().username === "admin"
        }
        return isAdmin || Meteor.isDevelopment;
        }

});

Template.home.events({
    // add your events here
});

Template.home.onCreated(() => {
    // add your statement here
});

Template.home.onRendered(() => {
    // add your statement here
});

Template.home.onDestroyed(() => {
    // add your statement here
});

