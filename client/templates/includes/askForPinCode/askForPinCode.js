import hubCrypto from "../../../lib/hubCrypto";
import User from "../../../../imports/classes/User";
import inviteController from "../../../lib/controllers/inviteController";
import cryptoTools from "../../../lib/cryptoTools";

Template.askForPinCode.helpers({
    //add you helpers here
    show: function () {
        return Session.get('askForPinCode') && Meteor.userId()
    },
    pinCode: function () {
        return Template.instance().pinCode.get()
    },
    parentInstance: function () {
        return Template.instance()
    },
    leftTentatives: function () {
        if (Meteor.user() && Meteor.user().private) {
            return Meteor.user().private.leftPinCodeTentatives + 1
        }

    },
    blockedUntil: function () {
        if (Meteor.user() && Meteor.user().private) {
            if (Meteor.user().private.blockedUntil > new Date()) {
                return Meteor.user().private.blockedUntil
            }
        }
    }
});

Template.askForPinCode.events({
    //add your events here
    'click [logOut]': function (event, instance) {
        event.preventDefault()
        Accounts.logout(() => {
            Meteor.setTimeout(() => {
                hubCrypto.destroyCryptoSession(() => {
                    Object.keys(Session.keys).forEach(function (key) {
                        Session.set(key, undefined);
                    })
                    Session.keys = {}
                    window.location.reload()
                    Session.set('askForPinCode', false)
                }, 50)

            },);
        })
    },
    "click [validate]": function (event, instance) {
        event.preventDefault()
        let user = User.findOne(Meteor.userId())

       user.callMethod("getPinCodeHash", window.localStorage.getItem("hashedPassword"), instance.pinCode.get(), (err, res) => {
            if (err) {
                console.log(err)
            } else {
                if (res) {
                    hubCrypto.decryptAndStorePrivateKeyInSession(res, "", () => {
                        hubCrypto.decryptAndStoreProjectListInSession(() => {


                            let invitationId = FlowRouter.current().queryParams.invitationId
                            let invitationPassword = FlowRouter.current().queryParams.password
                            if (invitationId && invitationPassword) {
                                inviteController.acceptInvitationId(invitationId, invitationPassword, (projectId) => {
                                    hubCrypto.decryptAndStoreProjectListInSession(() => {
                                        console.log(projectId)
                                        FlowRouter.go('/project/' + projectId + "/home")
                                        Materialize.toast(__('loginFormJs.welcome'), 6000, 'toastOk')
                                        Materialize.toast(__('loginPage.invitationAccepted'), 6000, 'toastOk')
                                    })

                                })
                            } else {
                                if (FlowRouter.current().route.name == "App.login") {
                                    FlowRouter.go('/')
                                    Materialize.toast("Bienvenue sur System-D", 6000, 'toastOk')
                                }
                            }
                            Session.set('askForPinCode', false)
                        })
                    })
                } else {
                    instance.pinCode.set("")
                }
            }
        })

    }
});

Template.askForPinCode.onCreated(function () {
    //add your statement here
    this.pinCode = new ReactiveVar("")
});

Template.askForPinCode.onRendered(function () {
    //add your statement here
});

Template.askForPinCode.onDestroyed(function () {
    //add your statement here
    Session.set('askForPinCode', false)
});

