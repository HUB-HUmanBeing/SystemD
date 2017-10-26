Template.userInvitation.helpers({
    //add you helpers here
    date : function () {
        return Template.instance().data.sendAt.toLocaleDateString()
    }
});

Template.userInvitation.events({
    //add your events here
});

Template.userInvitation.onCreated(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});

});

Template.userInvitation.onRendered(function () {
    //add your statement here
});

Template.userInvitation.onDestroyed(function () {
    //add your statement here
});

