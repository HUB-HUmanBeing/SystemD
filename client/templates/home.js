Template.home.helpers({
    // add you helpers here
    isallowed() {
        if(Meteor.user()) {
            return Meteor.user().username === "admin" || Meteor.isDevelopment;
        }
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

