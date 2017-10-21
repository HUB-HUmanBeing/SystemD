import User from '/imports/classes/User'

Template.userSelfProfile.helpers({

    completed : function () {
        return User.findOne(Meteor.userId()).completed();
    }
});

Template.userSelfProfile.events({
});

Template.userSelfProfile.onCreated(function () {

});

//
Template.userSelfProfile.onRendered(function () {
});

Template.userSelfProfile.onDestroyed(function () {
    //add your statement here
});

