import User from '/imports/classes/User'

Template.notifItem.helpers({
    //onrécupere la couleur des notifications a partir d'une deuxieme variable de session
    color: function () {
        return Session.get("formatedNotifsColor")
    }
});

Template.notifItem.events({
    //au click sur le lien
    "click [redirect]": function (event, instance) {
        //si la route pointe sur la page qu'on visite, on ferme la modale
        if (instance.data.formatedNotif.path === Iron.Location.get().path) {
            $('.modal').modal('close')
        }
        //on execute la redirection
        return true
    },
    //add your events here
    "click [deleteNotif]": function (event, instance) {
        //on récupere la nofi concernée
        let notif = instance.data.formatedNotif
        //on récupere l'utilisateur courant
        let user = User.findOne({_id: Meteor.userId()})
        //on appele la methote de suppression de la notification
        user.callMethod('deleteNotif', notif.type, notif.path, notif.content, (err) => {
            //s'il y a une erreur, on toast l'erreur
            if (err) {
                Materialize.toast("une erreur s'est produite", 4000, 'red');
            } else {
                //sinon, on attends un peu,
                Meteor.setTimeout(() => {
                    //si ya pluus de notifs on ferme la modale
                    console.log()
                    if (Session.get("formatedNotifsLength") === 0) {
                        $('.modal').modal('close')
                    }
                }, 100)

            }
        })
    }
});

Template.notifItem.onCreated(function () {
    //add your statement here

});

Template.notifItem.onRendered(function () {
    //add your statement here
});

Template.notifItem.onDestroyed(function () {
    //add your statement here
});

