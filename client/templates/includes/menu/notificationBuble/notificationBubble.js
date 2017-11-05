Template.notificationBubble.helpers({
    //true si l'on doit afficher les notifications
    openNotif : function () {
        return Template.instance().openNotif.get()
    },
    //helper permettant de transformer notre tableau de notifications
    // pour regrouper les notifications identiques avec un nombre devant, utile par exemple
    // pour ne pas saturer les notifs lorsque plusieurs commentaires
    // sont faits sur le meme article
    formatedNotifs : function () {
        //on récupere les notifs du template
        let notifications = Template.instance().data.notifications
        //le tableau de résultats
        let formatedNotifs = []
        //on boucle sur le tableau des notifications
        notifications.forEach((notification, i)=>{
            //on push dans le tableau de résultats la premiere :
            if(i===1){
                formatedNotifs.push({
                    content : notification.content,
                    path : notification.path,
                    delay : new Date().getTime() - notification.sendAt().getTime(),
                    nbOccurrence: 1
                })
                //si c'est pas la premiere itération
            }else{
                //on boucle sur le tableau des notifications formatées
                formatedNotifs.forEach((formatedNotif)=> {
                    //si on a déja une notif similaire : meme notif et meme path
                    if (formatedNotifs.content === notification.content
                        && formatedNotifs.path === notification.path) {
                        //on incrémente le nombre d'occurence
                        formatedNotif.nbOccurrence++
                        //on garde ensuite la date de la plus récente :
                        //on calcule le délai de la notification sur laquelle on boucle
                        delayOfCurrent = new Date().getTime() - notification.sendAt().getTime()
                        //si il est plus petit
                        if(delayOfCurrent < formatedNotif.delay){
                            //on lui assigne la valeur
                            formatedNotif.delay = delayOfCurrent
                        }
                    }else{ //si c'est l premiere fois qu'on voit passer cette notif
                        formatedNotifs.push({
                            content : notification.content,
                            path : notification.path,
                            delay : new Date().getTime() - notification.sendAt().getTime(),
                            nbOccurrence: 1
                        })
                    }
                })
            }
        })
        console.log(formatedNotifs)
        return formatedNotifs
    }
});

Template.notificationBubble.events({
    //lorsqu'on clique sur le nombre de notifications
    'click [openNotif]' : function (event, instance) {
        //on vient changer la valeur de
        instance.openNotif.set(!instance.openNotif.get());
        Meteor.setTimeout(function () {
            $('.modal').modal();
            $('#modal1').modal('open');
        }, 100)
    }
});

Template.notificationBubble.onCreated(function () {
    //add your statement here
    this.openNotif = new ReactiveVar(false)
});

Template.notificationBubble.onRendered(function () {
    //add your statement here
    $('.modal').modal();
});

Template.notificationBubble.onDestroyed(function () {
    //add your statement here
});

