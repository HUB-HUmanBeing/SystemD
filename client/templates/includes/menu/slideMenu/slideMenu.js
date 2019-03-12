import ProjectNotification from "../../../../../imports/classes/ProjectNotification";

Template.slideMenu.helpers({
    //add you helpers here
    sideNavIsOpen : function () {
        return Template.instance().sideNavIsOpen.get()
    },
    globalNotifCount: function () {
        return ProjectNotification.find().count()
    }
});

Template.slideMenu.events({
    //add your events here
});

Template.slideMenu.onCreated(function () {
    //add your statement here
    this.sideNavIsOpen =new ReactiveVar(false)
});

Template.slideMenu.onRendered(function () {
   let that=this
    //animation du slide-menu de matérializemeteor
    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens
        onOpen: function (el) {
           that.sideNavIsOpen.set(true)
        },
        onClose: function (el) {
            that.sideNavIsOpen.set(false)
        }
    });
});

Template.slideMenu.onDestroyed(function () {
    //add your statement here
});

