Template.menu.helpers({
    //tableau de tout ce qu'il y a dans le menu, permettant de pas trop repeter de html en bouclant dessus
    menuItems: function () {
       return arborescenceStructure()
    }
});

Template.menu.events({
    //gestion du bouton logout
    'click [logout]': function () {
        Accounts.logout();
        Router.go("home")
    },
    'click [newProject]': function () {
        $('.new-project-modal').modal();
        $('.new-project-modal').modal('open');
    }
});

Template.menu.onCreated(function () {
    //add your statement here
});

Template.menu.onRendered(function () {
    //initialisation des accordéons
    $('.collapsible').collapsible();
});

Template.menu.onDestroyed(function () {
    //add your statement here
});

