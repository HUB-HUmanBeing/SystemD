import User from '/imports/classes/User'

Template.userSelfProfile.helpers({
    completed : function () {
        return User.findOne(Meteor.userId()).completed();
    },
    isDeletable : function () {
        let user = User.findOne({_id : Meteor.userId()})
        return user.isDeletable()
    }
});

Template.userSelfProfile.events({
    //aaction de suppression definitive d'un compte utilisateur
    'click [deleteUserAccount]': function () {
        //on récupere l'utilisateur courant
        let currentProject = User.findOne({_id: Meteor.userId()})
        //on appele la methode de suppression
        currentProject.callMethod(
            'deleteUserAccount',
            (error) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    //sinon, on toast le succes,
                    Materialize.toast("Votre compte utilisateur à été définitivement supprimé", 6000, 'green')
                    //on ferme la modal
                    $('.modal').modal('close');
                    Meteor.logout()
                    //on redirige vers la page des projets utilisateurs
                    Router.go('home')
                }
            })
    }
});

Template.userSelfProfile.onCreated(function () {

});

//
Template.userSelfProfile.onRendered(function () {
    $('.modal').modal();
    $('.collapsible').collapsible();
});

Template.userSelfProfile.onDestroyed(function () {
    //add your statement here
});

