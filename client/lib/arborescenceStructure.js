import User from '/imports/classes/User';

arborescenceStructure = function () {

    //On récupère les données de l'utilisateur actuel
    let currentUser = Meteor.user();

    return [
        {
            id: "user",
            name: function () {
                return currentUser.username;
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
                    id: "userSelfProject",
                    name: "Mes Projets",
                    path: "userSelfProjects",
                    icon: "group_work"
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
            id: "project",
            name: "Mes Projets",
            color: "orange",
            image: "project_icon.png",
            subMenu: function () {
                    return User.findOne(currentUser._id).projectsData();
            },
        },
        {
            id: "message",
            name: "Messagerie",
            color: "teal",
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
            id: "agenda",
            name: "Agenda",
            color: "red",
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
            id: "sharing",
            name: "Partage",
            color: "deep-purple",
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
            color: "amber",
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
};