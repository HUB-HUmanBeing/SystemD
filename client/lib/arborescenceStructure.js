import User from '/imports/classes/User';

arborescenceStructure = function () {
    //On récupère les données de l'utilisateur actuel
  const currentUser = Meteor.user()
    //petit utilitaire nous permettant de trier les notifications de l'utilisateur par type
    let notifications = function (type) {
        let notif = [];
        currentUser.profile.notifications.forEach((notification)=>{
            if(notification.type === type){
                notif.push(notification)
            }
        })
        return notif
    }

    return [
        {
            id: "user",
            name: function () {
                return currentUser.username;
            },
            color: "green",
            image: "user_icon.png",
            notifications : function () {
                return notifications("user")
            },
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
                    id: "userSelfBlog",
                    name: "Mon Blog",
                    path: "userSelfBlog",
                    icon: "library_books"
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
            name: "Projets",
            color: "orange",
            image: "project_icon.png",
            notifications : function () {
                return notifications("project")
            },
            subMenu: function () {
                    return User.findOne(currentUser._id).projectsData();
            },
        },
        {
            id: "message",
            name: "Messagerie",
            color: "teal",
            image: "message_icon.png",
            notifications : function () {
                return notifications("message")
            },
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
            notifications : function () {
                return notifications("agenda")
            },
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
            notifications : function () {
                return notifications("sharing")
            },
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
            notifications : function () {
                return notifications("moderation")
            },
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