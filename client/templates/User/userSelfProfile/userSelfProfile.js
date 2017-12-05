import User from '/imports/classes/User';

Template.userSelfProfile.helpers({
    completed() {
        return User.findOne(Meteor.userId()).completed();
    },
    isDeletable() {
        let user = User.findOne({_id: Meteor.userId()});
        return user.isDeletable();
    },
    updatePasswordError : function () {
        return Template.instance().updatePasswordError.get()
    }
});

Template.userSelfProfile.events({
    // aaction de suppression definitive d'un compte utilisateur
    'click [deleteUserAccount]': function () {
        console.log('ok');
        // on récupere l'utilisateur courant
        const currentUser = User.findOne({_id: Meteor.userId()});
        $('.modal').modal('close');
        // on redirige vers la page des projets utilisateurs
        Router.go('home');
        // on appele la methode de suppression
        currentUser.callMethod(
            'deleteUserAccount',
            (error) => {
                // si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red');
                } else {
                    // sinon, on toast le succes,
                    Materialize.toast('Votre compte utilisateur à été définitivement supprimé', 6000, 'green');
                    // on ferme la modal
                }
            },
        );
    },
    'keyup [newPassword], keyup [newPasswordRepeat]' : function (event,instance) {
        let newPassword = $('#newPassword').val()
        let newPasswordRepeat = $('#newPasswordRepeat').val()
        if(newPassword.length<6 || newPasswordRepeat.length<6){
            instance.updatePasswordError.set("Le mot de passe doit comporter au moins 6 caractères")
        }else if(newPasswordRepeat !== newPassword){
            instance.updatePasswordError.set("Les mots de passe ne sont pas identiques")
        }else{
            instance.updatePasswordError.set("")
        }
    },
    'click [updatePassword], submit [updatePasswordForm]' : function (event, instance) {
        let oldPassword = $('#oldPassword').val()
        let newPassword = $('#newPassword').val()

        Accounts.changePassword(oldPassword, newPassword, (err)=>{
            if (err) {
                Materialize.toast(err, 4000, 'red');
            } else {
                // sinon, on toast le succes,
                Materialize.toast('Votre mot de passe a été modifié', 6000, 'green');
                $('#oldPassword').val("")
                $('#newPassword').val("")
                $('#newPasswordRepeat').val("")
            }
        })
    }
});

Template.userSelfProfile.onCreated(() => {
    Template.instance().updatePasswordError = new ReactiveVar("")
});

//
Template.userSelfProfile.onRendered(() => {
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('.swipable').tabs(
        // { 'swipeable': true }
    );
    Materialize.updateTextFields();
});

Template.userSelfProfile.onDestroyed(() => {
    // add your statement here
});

