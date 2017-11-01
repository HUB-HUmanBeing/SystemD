Template.messagesProject.helpers({
    //add you helpers here
    //pour renvoyer vers l'enfant les infos du projet courant
    project : function(){
        return Template.instance().data.fetch()[0]
    },
});

Template.messagesProject.events({
    //add your events here
});

Template.messagesProject.onCreated(function () {
    //add your statement here
});

Template.messagesProject.onRendered(function () {
    //add your statement here
});

Template.messagesProject.onDestroyed(function () {
    //add your statement here
});

