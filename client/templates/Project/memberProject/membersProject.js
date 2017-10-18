Template.membersProject.helpers({
    //add you helpers here
    project : function(){
        return Template.instance().data.fetch()[0]
    }
});

Template.membersProject.events({
    //add your events here
});

Template.membersProject.onCreated(function () {
    //add your statement here
});

Template.membersProject.onRendered(function () {
    //add your statement here
});

Template.membersProject.onDestroyed(function () {
    //add your statement here
});

