Template.adminProject.helpers({
    //pour renvoyer vers l'enfant les infos du projet courant
    project : function(){
        return Template.instance().data.fetch()[0]
    },
    //
    completed : function () {
        return Template.instance().data.fetch()[0].completed()

    }
});

Template.adminProject.events({
    //add your events here
});

Template.adminProject.onCreated(function () {
    //add your statement here
});

Template.adminProject.onRendered(function () {
    //add your statement here
    $('.swipable').tabs(
      // { 'swipeable': true }
        );
});

Template.adminProject.onDestroyed(function () {
    //add your statement here
});

