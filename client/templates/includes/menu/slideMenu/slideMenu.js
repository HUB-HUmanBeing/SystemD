Template.slideMenu.helpers({
    //add you helpers here
});

Template.slideMenu.events({
    //add your events here
});

Template.slideMenu.onCreated(function () {
    //add your statement here
});

Template.slideMenu.onRendered(function () {

    //animation du slide-menu de matérializemeteor
    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });
});

Template.slideMenu.onDestroyed(function () {
    //add your statement here
});

