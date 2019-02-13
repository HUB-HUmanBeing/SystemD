import hubCrypto from "../../lib/hubCrypto";

Template.layout.helpers({});

Template.layout.events({
    //add your events here
});

Template.layout.onCreated(function () {

    Tracker.autorun(() => {
        Meteor.setTimeout(()=>{
            let userId = Meteor.userId()
            const hashedPassword = window.localStorage.getItem('hashedPassword')
            if (userId){
                if(hashedPassword) {
                    Meteor.subscribe("UserPrivateInfo", userId, () => {
                        hubCrypto.initCryptoSession(hashedPassword, Meteor.user().username, () => {
                        })
                    })
                }else{
                    hubCrypto.destroyCryptoSession(() => {

                    })
                    Meteor.logout()
                }
            } else {
                hubCrypto.destroyCryptoSession(() => {

                })
            }
        },300)
    })

});

Template.layout.onRendered(function () {
    //add your statement here
});

Template.layout.onDestroyed(function () {
    //add your statement here
});

