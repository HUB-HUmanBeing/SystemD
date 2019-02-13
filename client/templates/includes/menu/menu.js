import hubCrypto from "../../../lib/hubCrypto";

Template.menu.helpers({
    //tableau de tout ce qu'il y a dans le menu, permettant de pas trop repeter de html en bouclant dessus
    menuItems: function () {
       return arborescenceStructure()
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
    $('.collapsible').collapsible();

    $(".dropdown-button").dropdown({
        belowOrigin: true
    });
});

Template.menu.onDestroyed(function () {
    //add your statement here
});

