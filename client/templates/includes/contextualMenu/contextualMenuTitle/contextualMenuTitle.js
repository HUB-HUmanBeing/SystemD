Template.contextualMenuTitle.helpers({
    //add you helpers here
});

Template.contextualMenuTitle.events({
    //add your events here
    'click [redirectToSectionHome]' : function (event, instance) {
        Router.go(instance.data.path, {_id : instance.data.pathData})
    }
});

Template.contextualMenuTitle.onCreated(function () {
    //add your statement here
});

Template.contextualMenuTitle.onRendered(function () {
    //add your statement here
});

Template.contextualMenuTitle.onDestroyed(function () {
    //add your statement here
});

