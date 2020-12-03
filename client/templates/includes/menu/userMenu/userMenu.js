Template.userMenu.helpers({
    //add you helpers here
    isActive: function (){
        FlowRouter.watchPathChange()
        return FlowRouter.current().route.name == "App.messenger"
    }
});

Template.userMenu.events({
    //add your events here
});

Template.userMenu.onCreated(function () {
    //add your statement here
});

Template.userMenu.onRendered(function () {
    //add your statement here
});

Template.userMenu.onDestroyed(function () {
    //add your statement here
});

