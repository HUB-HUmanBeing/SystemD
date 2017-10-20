Template.adminProject.helpers({
    //add you helpers here
    project : function(){
        return Template.instance().data.fetch()[0]
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

