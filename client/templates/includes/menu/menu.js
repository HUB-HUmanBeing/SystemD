Template.menu.helpers({
    //tableau de tout ce qu'il y a dans le menu, permettant de pas trop repeter de html en bouclant dessus
    menuItems: function () {
       return arborescenceStructure()
    }
});

Template.menu.events({
    //gestion du bouton logout
    'click [logout]': function () {
        Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
        Session.keys = {}
        Accounts.logout(()=>{
            Router.go("home")
            // window.location.reload()
        });

    },
    'click [newProject]': function () {
        $('.new-project-modal').modal();
        $('.new-project-modal').modal('open');
    },
    'submit [searchForm], click [searchBtn]' : function (event, instance) {
        event.preventDefault()
        let userInput = document.getElementById("generalSearchInput").value
        Session.set('openSearchModal', true)
        Session.set('searchedInput', userInput)
        $('.search-modal').modal({
                complete: function() {
                    Session.set('searchedInput', false)
                    Session.set('openSearchModal', false)
                } // Callback for Modal close
            }
        );
        $('.search-modal').modal('open')
    }
});

Template.menu.onCreated(function () {
});

Template.menu.onRendered(function () {
    //initialisation des accordéons
    $('.collapsible').collapsible();
});

Template.menu.onDestroyed(function () {
    //add your statement here
});

