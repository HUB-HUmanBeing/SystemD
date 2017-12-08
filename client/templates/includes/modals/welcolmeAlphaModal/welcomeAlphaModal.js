Template.welcomeAlphaModal.helpers({
    //add you helpers here
});

Template.welcomeAlphaModal.events({
    //add your events here
});

Template.welcomeAlphaModal.onCreated(function () {
    //add your statement here
});

Template.welcomeAlphaModal.onRendered(function () {
    //add your statement here
    if(!Meteor.isDevelopment){
        $('.modal').modal();
        if(!Session.get("alreadyVisited")){
            $('#welcomeAlphaModal').modal('open');
            Session.set("alreadyVisited", true)
        }

    }

});

Template.welcomeAlphaModal.onDestroyed(function () {
    //add your statement here
    if(!Meteor.isDevelopment){
        $('.modal').modal('close');
    }

});

