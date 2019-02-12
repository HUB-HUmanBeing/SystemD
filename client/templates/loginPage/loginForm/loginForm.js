import hubCrypto from "../../../lib/hubCrypto";
import cryptoTools from "../../../lib/cryptoTools";

Template.loginForm.helpers({
    //add you helpers here
    loginComplete: function () {
        return Template.instance().loginComplete.get()
    }
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
                instance.loginComplete.set([
                    'Récupération et déchiffrement de la clef privée',
                    'Initialisation d\'une nouvelle session chiffrée'
                ])
                cryptoTools.hash(password, (hashedPassword) => {
                    window.localStorage.setItem('hashedPassword', hashedPassword)
                    hubCrypto.initCryptoSession(hashedPassword, username, () => {
                    })
                })
                Meteor.setTimeout(() => {
                    FlowRouter.go('/')
                    Materialize.toast("Bienvenue sur System-D", 6000, 'light-bg')

                }, 3000)
            }
            // hubCrypto.initCryptoSession(password,username, ()=>{
            //
            // })
        })
    }
});

Template.loginForm.onCreated(function () {
    //add your statement here
    this.loginComplete = new ReactiveVar(undefined)
});

Template.loginForm.onRendered(function () {

});

Template.loginForm.onDestroyed(function () {
    //add your statement here
});

