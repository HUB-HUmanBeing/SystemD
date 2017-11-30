Template.notifModal.helpers({
    openNotifPannel: function () {
        return (Session.get("openNotifPannel"))
    },
    //add you helpers here
    formatedNotifs: function () {
        //on récupere le type de notif qu'on doit afficher
        NotificationsCurrentType = Session.get("formatedNotifsType")
        //puis on va les formatter pour regrouper les notifications
        // identiques avec un nombre devant, utile par exemple
        // pour ne pas saturer les notifs lorsque plusieurs commentaires
        // sont faits sur le meme article

        //le tableau de résultatson crée le tableau de resultat
        let formatedNotifs = [];
        //on récupere les notifs du template
        //on cree untableau vide pour acceuillir les notifs
        let notifications = [];
        //on recupere et trie les notifications en choisisant celles qu'on veut formatter
        // c'est sur, cest notif ont été formattées ailleurs, mais bon en les re-récupérant, on a l'assurance que les données dedans soient réactives
        Meteor.user().profile.notifications.forEach((notif) => {
            if (notif.type === NotificationsCurrentType) {
                notifications.push(notif)
            }
        })

        //si ce tableau contient des notifications
        if (notifications !== []) {
            //on leur associera aussi un id, afin de pouvoir retrouver
            let id = 0
            //on boucle sur le tableau des notifications
            notifications.forEach((notification, i) => {
                //on push dans tout les cas dans le tableau de résultats la premiere notification que l'on formatte:
                if (i === 0) {
                    formatedNotifs.push({
                        content: notification.content,
                        path: notification.path,
                        type: notification.type,
                        id: "swipable-notif-" + id.toString(),
                        //on aura une durée par raport a maintenant
                        delay: new Date().getTime() - notification.sendAt.getTime(),
                        nbOccurrence: 1
                    })
                    //on incrémente l'id
                    id++
                    //puis, si c'est pas la premiere itération
                } else {
                    //on va chercher a savoir si une notif similaire est déja dans la tables
                    //on crée un drapeau a false
                    let notifFoundInFormattedNotif = false
                    //on boucle sur le tableau des notifications formatées
                    formatedNotifs.forEach((formatedNotif) => {
                        //si on a déja une notif similaire : meme notif et meme path
                        if (formatedNotif.content === notification.content
                            && formatedNotif.path === notification.path) {
                            notifFoundInFormattedNotif = true
                            //on incrémente le nombre d'occurence
                            formatedNotif.nbOccurrence++
                            //on garde ensuite la date de la plus récente :
                            //on calcule le délai de la notification sur laquelle on boucle
                            let delayOfCurrent = new Date().getTime() - notification.sendAt.getTime()
                            //si il est plus petit
                            if (delayOfCurrent < formatedNotif.delay) {
                                //on lui assigne la valeur
                                formatedNotif.delay = delayOfCurrent
                            }
                        }
                    })
                    if (!notifFoundInFormattedNotif) { //si c'est l premiere fois qu'on voit passer cette notif
                        formatedNotifs.push({
                            content: notification.content,
                            path: notification.path,
                            type: notification.type,
                            id: "swipable-notif-" + id.toString(),
                            delay: new Date().getTime() - notification.sendAt.getTime(),
                            nbOccurrence: 1
                        })
                        //on incrémente l'id
                        id++
                    }

                }
            })
        }
        //les notifs en cours,on en aura besoin pour le comportement swipable
        Session.set("formatedNotifs", formatedNotifs)
        //nombre total de notif du type en cours
        Session.set("formatedNotifsLength", formatedNotifs.length)
        return formatedNotifs
    }
});

Template.notifModal.events({
    //add your events here
});

Template.notifModal.onCreated(function () {
    //add your statement here

});

Template.notifModal.onRendered(function () {
    //add your statement here
});

Template.notifModal.onDestroyed(function () {
    //add your statement here
    $('.modal').modal('close');
});

