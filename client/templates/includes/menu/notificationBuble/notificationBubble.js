


Template.notificationBubble.helpers({
});

Template.notificationBubble.events({
    //lorsqu'on clique sur le nombre de notifications
    'click [openNotif]' : function (event, instance) {
//on passe en variable de session le type de notifications a afficher dans le panneau de notifications
        Session.set("formatedNotifsType" , instance.data.itemId)
        Session.set("formatedNotifsColor", instance.data.color)
       $('.notif-box li').css("opacity", "0")
        Meteor.setTimeout(function () {
            Materialize.showStaggeredList('#notif-list')
        },100)

    }
});

Template.notificationBubble.onCreated(function () {

});

Template.notificationBubble.onRendered(function () {
    //add your statement here
    $('.modal').modal();
});

Template.notificationBubble.onDestroyed(function () {
    //add your statement here
});

