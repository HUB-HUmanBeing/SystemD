Template.contextualMenuTitle.helpers({
    //add you helpers here
});

Template.contextualMenuTitle.events({
    //add your events here
    'click [redirectToSectionHome]' : function (event, instance) {
        dump(instance.data.path)
        Router.go(instance.data.path, {_id : instance.data.pathData})
    }
});

Template.contextualMenuTitle.onCreated(function () {
    //add your statement here
});

Template.contextualMenuTitle.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
});

Template.contextualMenuTitle.onDestroyed(function () {
    //add your statement here
});

