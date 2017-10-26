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
                let items = [];
                Meteor.user().profile.projects.forEach(function (project) {
                    items.push({
                        id: project.project_id,
                        name: project.name,
                        path: "projectMainPage",
                        icon: "arrow_forward",
                        pathData : function () {
                            return { _id : project.project_id}
                        }
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
            id: "message",
            name: "Messagerie",
            color: "blue",
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