Template.agendaMenu.helpers({
    //nom de la page pour pouvoir utiliser le "is active path"
    contextualHomepage : function () {
        return 'selfCalendar'
    },
    //couleur du sous menu
    color: function () {
        return 'red'
    },
    //on transmet le path  vers lequel ca doir renvoyer
    path: function () {
        return Router.path("selfCalendar")
    },
    //tableau des elements a renvoyer a la barre de navigation
    navBarItems: function () {

            let navBarItems = [
                {
                    title: "Liste des taches",
                    color: "red",
                    routeName: "selfTodo",
                    path: function () {
                        return Router.path("selfTodo")
                    }
                }
            ]
            return navBarItems

    },
});

Template.agendaMenu.events({
    //add your events here
});

Template.agendaMenu.onCreated(function () {
    //add your statement here
});

Template.agendaMenu.onRendered(function () {
    //add your statement here
});

Template.agendaMenu.onDestroyed(function () {
    //add your statement here
});

