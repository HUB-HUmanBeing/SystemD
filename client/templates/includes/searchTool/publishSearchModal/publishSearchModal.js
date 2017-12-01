Template.publishSearchModal.helpers({
    //add you helpers here
});

Template.publishSearchModal.events({
    //add your events here
});

Template.publishSearchModal.onCreated(function () {
    //add your statement here
});

Template.publishSearchModal.onRendered(function () {
    //add your statement here
    $('#publishSearchModal').modal()
    Meteor.setTimeout(()=>{
        $('#publishSearchModal').modal('open')
    },50)
    resetTooltips()
});

Template.publishSearchModal.onDestroyed(function () {

});

