Template.userMainPage.helpers({
    //add you helpers here
    user : function () {
        return Template.instance().data.fetch()[0]
    }
});

Template.userMainPage.events({
    //add your events here
});

Template.userMainPage.onCreated(function () {
    //add your statement here
});

Template.userMainPage.onRendered(function () {
    //add your statement here
});

Template.userMainPage.onDestroyed(function () {
    //add your statement here
});

