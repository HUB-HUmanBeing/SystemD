Template.menu.helpers({
    //tableau de tout ce qu'il y a dans le menu, permettant de pas trop repeter de html en bouclant dessus
    menuItems: [
        {
            id: "user",
            name: function () {
                return Meteor.user().username;
            },
            color: "green",
            image: "user_icon.png",
            subMenu: [

                {
                    id: "userSelfProfile",
                    name: "Mon profil",
                    path: "userSelfProfile",
                    icon: "person"
                },
                {
                    id: "logout",
                    name: "Déconnexion",
                    path: "home",
                    icon: "exit_to_app"
                },
            ]
        },
        {
            id: "message",
            name: "Messagerie",
            color: "orange",
            image: "message_icon.png",
            subMenu: [
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
            ]
        },
        {
            id: "Agenda",
            name: "Agenda",
            color: "blue",
            image: "agenda_icon.png",
            subMenu: [
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
            ]
        },
        {
            id: "projects",
            name: "Mes Projets",
            color: "red",
            image: "project_icon.png",
            subMenu: function () {
                let items = [];
                Meteor.user().profile.projects.forEach(function (project) {
                    items.push({
                        id: project.project_id,
                        name: project.name,
                        path: "projectMainPage",
                    })
                });
                items.push({
                    id: "newProject",
                    name: "Nouveau Projet",
                    path: "#",
                    icon: "add_box"
                });
                return items
            },
        },
        {
            id: "sharing",
            name: "Partage",
            color: "purple",
            image: "sharing_icon.png",
            subMenu: [
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },

            ]
        },
        {
            id: "moderation",
            name: "Modération",
            color: "yellow",
            image: "moderation_icon.png",
            subMenu: [
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
                {
                    id: "lorem",
                    name: "lorem",
                    path: "workInProgress"
                },
            ]
        }
    ]
});

Template.menu.events({
    //gestion du bouton logout
    'click [logout]': function () {
        Accounts.logout();
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

