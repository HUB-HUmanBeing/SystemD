import hubCrypto from "../../../lib/hubCrypto";

Template.loginForm.helpers({
    //add you helpers here

});

Template.loginForm.events({
    //add your events here
    'submit #loginForm ': function (event, instance) {
        event.preventDefault()

        let username = $('#loginUsername').val();
        let password = $('#loginPassword').val()
        //on soumet le login
        Meteor.loginWithPassword(username, password, function (error) {
            // si il y a une erreur, on "toast" le message d'erreur

            if (error) {
                Materialize.toast(error.message, 6000, 'red')();
            } else {
                FlowRouter.go('/')
                Materialize.toast("Bienvenue sur System-D", 6000, 'green darken-2')
            }
            // hubCrypto.initCryptoSession(password,username, ()=>{
            //
            // })
        })
    }
});

Template.loginForm.onCreated(function () {
    //add your statement here

});

Template.loginForm.onRendered(function () {

});

Template.loginForm.onDestroyed(function () {
    //add your statement here
});

