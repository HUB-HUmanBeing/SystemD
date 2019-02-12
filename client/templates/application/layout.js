import hubCrypto from "../../lib/hubCrypto";

Template.layout.helpers({});

Template.layout.events({
    //add your events here
});

Template.layout.onCreated(function () {
    let userId = Meteor.userId()
    const hashedPassword = window.localStorage.getItem('hashedPassword')
    if (userId && hashedPassword) {
        Meteor.subscribe("UserPrivateInfo", userId, () => {
            hubCrypto.initCryptoSession(hashedPassword, Meteor.user().username,()=>{
            })
        })
    } else {
        hubCrypto.destroyCryptoSession(() => {

        })
    }

});

Template.layout.onRendered(function () {
    //add your statement here
});

Template.layout.onDestroyed(function () {
    //add your statement here
});

