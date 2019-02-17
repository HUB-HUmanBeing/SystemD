import hubCrypto from "/client/lib/hubCrypto";


Template.menu.helpers({
    //tableau de tout ce qu'il y a dans le menu, permettant de pas trop repeter de html en bouclant dessus
    userProjects: function () {
       return []
    }
});

Template.menu.events({
    //gestion du bouton logout
    'click [logout]': function () {


            Accounts.logout(()=>{
               Meteor.setTimeout(()=>{
                   hubCrypto.destroyCryptoSession(()=>{
                       Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
                       Session.keys = {}
                       window.location.reload()
               },50)

            });
        })


    },

});

Template.menu.onCreated(function () {
});

Template.menu.onRendered(function () {
    //initialisation des accordéons
    Meteor.setTimeout(()=>{
        $(".dropdown-button").dropdown({
            belowOrigin: true
        });
    },400)

});

Template.menu.onDestroyed(function () {
    //add your statement here
});

