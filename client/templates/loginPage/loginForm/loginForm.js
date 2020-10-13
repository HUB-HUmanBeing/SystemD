import hubCrypto from "../../../lib/hubCrypto";
import cryptoTools from "../../../lib/cryptoTools";
import inviteController from "../../../lib/controllers/inviteController";

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
        instance.loginComplete.set([
            __('loginFormJs.key'),
            __('loginFormJs.session')
        ])
        Meteor.loginWithPassword(username, password, function (error) {
            // si il y a une erreur, on "toast" le message d'erreur

            if (error) {
                instance.loginComplete.set(undefined)
                Materialize.toast(error.message, 6000, 'toastError');
            } else {
                let hashedPassword = cryptoTools.heavyHash(password, username)
                Meteor.subscribe("UserPrivateInfo", Meteor.userId(), () => {
                    window.localStorage.setItem('hashedPassword', hashedPassword)
                    hubCrypto.initCryptoSession(hashedPassword, username, () => {

                        let invitationId = FlowRouter.current().queryParams.invitationId
                        let invitationPassword = FlowRouter.current().queryParams.password
                        if (invitationId && invitationPassword) {
                            inviteController.acceptInvitationId(invitationId, invitationPassword, (projectId) => {
                                hubCrypto.decryptAndStoreProjectListInSession(() => {
                                    FlowRouter.go('/project/' + projectId + "/home")
                                    Materialize.toast(__('loginFormJs.welcome'), 6000, 'toastOk')
                                    Materialize.toast(__('loginPage.invitationAccepted'), 6000, 'toastOk')
                                })

                            })
                        } else {
                            FlowRouter.go('/')
                            Materialize.toast(__("loginFormJs.welcome"), 6000, 'toastOk')
                        }
                    })


                })
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

