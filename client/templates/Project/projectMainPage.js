Template.projectMainPage.helpers({
    //add you helpers here
    project : function(){
        return Template.instance().data.fetch()[0]
    }
});

Template.projectMainPage.events({
    //add your events here
});

Template.projectMainPage.onCreated(function () {
    //add your statement here
});

Template.projectMainPage.onRendered(function () {
    //add your statement here
});

Template.projectMainPage.onDestroyed(function () {
    //add your statement here
});

