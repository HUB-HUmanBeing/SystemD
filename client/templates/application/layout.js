import hubCrypto from "../../lib/hubCrypto";
import i18n from "meteor/universe:i18n";
import moment from "../../lib/i18nMoment";
import pushController from "../../lib/controllers/pushController";

Template.layout.helpers({
    showAcceptNotifTemplate: function () {
        return Session.get("showAcceptNotif")
    }
});

Template.layout.events({
    //add your events here
});

Template.layout.onCreated(function () {

    this.autorun(() => {

        let userId = Meteor.userId()
        const hashedPassword = window.localStorage.getItem('hashedPassword')
        if (userId) {
            if (hashedPassword) {
                Meteor.subscribe("UserPrivateInfo", userId, () => {
                    let language = Meteor.user().public.language
                    if (language !== i18n.getLocale()) {
                        i18n.setLocale(language)
                        localStorage.setItem('lang', language);
                        moment.locale(language)
                    }
                    let timer = 1000 - Meteor.user().private.projects.length * 60
                    Meteor.setTimeout(() => {
                        if(!Session.get("stringifiedAsymPrivateKey")){
                            if(Meteor.user().public.securized){
                                Session.set("askForPinCode", true)
                            }else {
                                hubCrypto.initCryptoSession(hashedPassword, Meteor.user().username, () => {

                                })
                            }
                        }
                    }, timer > 0 ? timer : 0)

                    if (Meteor.user().private.projects.length) {
                        pushController.initialize(Meteor.user())
                    }
                })
            } else {
                hubCrypto.destroyCryptoSession(() => {

                })
                Meteor.logout()
            }
        } else {
            hubCrypto.destroyCryptoSession(() => {

            })
        }

    })

});

Template.layout.onRendered(function () {
    //add your statement here
});

Template.layout.onDestroyed(function () {
    //add your statement here
});

