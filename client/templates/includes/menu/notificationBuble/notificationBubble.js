


Template.notificationBubble.helpers({
});

Template.notificationBubble.events({
    //lorsqu'on clique sur le nombre de notifications
    'click [openNotif]' : function (event, instance) {
//on passe en variable de session le type et leurs couleurs des notifications a afficher dans le panneau de notifications
        Session.set("formatedNotifsType" , instance.data.itemId);
        Session.set("formatedNotifsColor", instance.data.color);
        //on ouvre le panneau de notification dans la modale via cette réactiveVar
        Session.set("openNotifPannel", true);
        //on attends que ca soit dans le dom
        Meteor.setTimeout(function () {
            //on passe les notifications en opacité 0 pour l'effet arrivée en dégradé
           $('.notif-box li').css("opacity", "0");
           //et on lance l'effet avec un petit décalage encore
            Meteor.setTimeout(function () {
                Materialize.showStaggeredList('#notif-list')
            },100)
        },30)
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

