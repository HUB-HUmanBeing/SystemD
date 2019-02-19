import hubCrypto from "/client/lib/hubCrypto";
//https://www.npmjs.com/package/beautify-scrollbar
import BeautifyScrollbar from 'beautify-scrollbar';

Template.menu.helpers({
    //tableau de tout ce qu'il y a dans le menu, permettant de pas trop repeter de html en bouclant dessus
    showProjects: function () {
        return !!Session.get("projects")
    },
    showInfo:function () {
        return Template.instance().showInfo.get()
    }
});

Template.menu.events({
    //gestion du bouton logout
    'click [logout]': function () {


        Accounts.logout(() => {
            Meteor.setTimeout(() => {
                hubCrypto.destroyCryptoSession(() => {
                    Object.keys(Session.keys).forEach(function (key) {
                        Session.set(key, undefined);
                    })
                    Session.keys = {}
                    window.location.reload()
                }, 50)

            });
        })


    },

});

Template.menu.onCreated(function () {
    this.showInfo = new ReactiveVar()
});

Template.menu.onRendered(function () {
    //initialisation des accordéons
    Meteor.setTimeout(() => {
        $("#userOptionsBtn").dropdown({
            belowOrigin: true
        });
    }, 800)
    Meteor.setTimeout(()=>{
        this.showInfo.set(true)
    },1500)

});

Template.menu.onDestroyed(function () {
    //add your statement here
});

