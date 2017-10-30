import User from '/imports/classes/User'

Template.userInvitation.helpers({
    //helpeur pour formater la date
    date : function () {
        return Template.instance().data.sendAt.toLocaleDateString()
    }
});

Template.userInvitation.events({
    /*****************************
     * Accepter l'invitation à rejoindre le projet
     */
    'click [joinProject]' : function (event, instance) {
        event.preventDefault()
        //on instancie la classe user d'astronomy
        let currentUser = User.findOne(Meteor.userId())
        //on apelle la methode d'acceptation d'une invitaation
        currentUser.callMethod('acceptInvitation', instance.data.project_id, (error)=>{
            //on donne un feedback a l'utilisateur
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                //on toast un feedback a l'utilisateur
                Materialize.toast("Vous faites désormais parti des membres du projet", 6000, 'green')
                $('.tooltipped').tooltip('remove');
                //et on les remets apres un court délai (pour eviter que ne reste affichée
                // celle qui etait en hover au moment du click)
                Meteor.setTimeout(function () {
                    $('.tooltipped').tooltip({delay: 50});
                }, 100)
                //et on redirige vers la page du projet qu'on vient de joindre
                Router.go('adminProject' , { _id : instance.data.project_id})

            }
        })
    },
    /*********************************
     * action d'un utilisateur pour décliner une invitation de la part d'un projet
     * @param event
     * @param instance
     */
    'submit [declineInvitation]' : function (event, instance) {
        event.preventDefault()
        //on récupere la valeur du message de refus
        let declineMessage = event.currentTarget.declineMessage.value
        //on instancie notre utilisateur
        let currentUser = User.findOne(Meteor.userId())
        //on appele la methode décliner l'invitation
        currentUser.callMethod(
            'declineInvitation',
            instance.data.project_id,
            declineMessage,
            (error) =>{
                //on donne un feedback a l'utilisateur
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {

                    //on toast un feedback a l'utilisateur
                    Materialize.toast("vous avez décliné l'invitation", 6000, 'orange')
                    $('.tooltipped').tooltip('remove');
                    //et on les remets apres un court délai (pour eviter que ne reste affichée
                    // celle qui etait en hover au moment du click)
                    //on ferme la fenetre modale
                    $('.modal').modal('close')
                    Meteor.setTimeout(function () {
                        $('.tooltipped').tooltip({delay: 50});
                    }, 100)


                }

        })
    }
});

Template.userInvitation.onCreated(function () {
    //add your statement here


});

Template.userInvitation.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
});

Template.userInvitation.onDestroyed(function () {
    //add your statement here
});

