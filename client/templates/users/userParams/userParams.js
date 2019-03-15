Template.userParams.helpers({
    //add you helpers here
});

Template.userParams.events({

});

Template.userParams.onCreated(function () {
    //add your statement here
});

Template.userParams.onRendered(function () {
    //add your statement here
    Meteor.setTimeout(()=>{
        $('#editPasswordCollapse').collapsible();
    },1000)

});

Template.userParams.onDestroyed(function () {
    //add your statement here
    $('#editPasswordCollapse').collapsible('destroy');
});

