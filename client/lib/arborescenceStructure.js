arborescenceStructure = function () {
    return [
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
            id: "agenda",
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
}