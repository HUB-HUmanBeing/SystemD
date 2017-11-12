Template.home.helpers({
    // add you helpers here
    isDevelopment() {
        return Meteor.isDevelopment;
    },
    isRobin() {
        return Meteor.user().username === "robin"
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

